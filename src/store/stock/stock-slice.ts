import { createSlice } from "@reduxjs/toolkit";
import { BillRequestAction, COLLECTIONS, CRUDRequest } from "../../constants";
import { MissingProductsDoc, StockDoc } from "../../interfaces";
import { StockInitialState } from "../../interfaces/redux-store";
import { deleteData, readData, sendData, updateData } from "../../services/api";
import { BillType } from "../../types/bills";
import { AppDispatch } from "../index";
import {
  deleteMissingProduct,
  insertMissingProduct,
} from "../missing-products/missing-products-slice";

const initialState: StockInitialState = {
  isLoading: false,
  error: null,
  data: [],
  productsInStore: [],
  filteredStockData: [],
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    fetchingStockData(state, action) {
      state.isLoading = true;
    },
    errorStockData(state, action) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    addStockData(state, action) {
      state.data = action.payload.data;
      state.filteredStockData = action.payload.data.filter(
        (product: StockDoc) => product.totalNumberOfUnits > 0
      );
      state.productsInStore = action.payload.data.filter(
        (product: StockDoc) => product.totalNumberOfUnits > 0
      );
      state.isLoading = false;
      state.error = null;
    },
    filterStockData(state, action) {
      let tempStockData = [...state.data];
      tempStockData = tempStockData.filter(
        (data) =>
          data.productName.includes(action.payload.searchValue) &&
          data.totalNumberOfUnits > 0
      );
      state.filteredStockData = tempStockData;
    },
    updateStockProductsFromBill(state, action) {
      action.payload.updatedStockProducts.forEach((billProduct: StockDoc) => {
        //prettier-ignore
        const stockProductIndex = state.data.findIndex((stockProduct: StockDoc) => stockProduct.id === billProduct.id);
        if (stockProductIndex >= 0) {
          state.data[stockProductIndex] = billProduct;
        }
      });
    },
  },
});

export const stockActions = stockSlice.actions;

export const addStockDataToStore = () => async (dispatch: AppDispatch) => {
  dispatch(stockActions.fetchingStockData({}));
  try {
    const stockData = await readData(COLLECTIONS.STOCK);
    dispatch(stockActions.addStockData({ data: stockData }));
  } catch (err) {
    dispatch(stockActions.errorStockData({}));
  }
};

export const transformDataFromNormalBillToStock =
  (data: any) => async (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];

    const updatedStockData = data.billData.products.map((billProduct: any) => {
      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) => stockProduct.id === billProduct.id
      );
      const stockProductInBill = stockData.find(
        (stockProduct: StockDoc) => stockProduct.id === billProduct.id
      );

      let updatedProduct: StockDoc = {} as StockDoc;

      // IF BILL PRODUCT IS FOUND IN STOCK !!!
      if (stockProductInBillIndex >= 0) {
        updatedProduct = { ...stockData[stockProductInBillIndex] };

        const missingProduct: MissingProductsDoc = {
          productName: updatedProduct.productName,
          createdAt: new Date().toString(),
          category: updatedProduct.category,
          priceOfPiece: updatedProduct.priceOfPiece,
        };

        if (data.billData.type === BillType.NORMAL_BILL) {
          if (data.action === BillRequestAction.ADD_BILL) {
            console.log("ON ADD NORMAL BILL");
            updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;
            if (updatedProduct.totalNumberOfUnits <= 0) {
              //prettier-ignore
              dispatch(insertMissingProduct(missingProduct));
            }
          }
          if (data.action === BillRequestAction.UPDATE_BILL) {
            if (billProduct.oldProductAmount) {
              //prettier-ignore
              if (billProduct.totalProductAmount > billProduct.oldProductAmount) {
                //prettier-ignore
                updatedProduct.totalNumberOfUnits -= billProduct.initialProductAmount;
                if (updatedProduct.totalNumberOfUnits <= 0) {
                  //prettier-ignore
                  dispatch(insertMissingProduct(missingProduct));
                }
              } else {
                updatedProduct.totalNumberOfUnits +=
                  billProduct.initialProductAmount;
              }
            }
          }
          if (data.action === BillRequestAction.DELETE_BILL) {
            updatedProduct.totalNumberOfUnits += billProduct.totalProductAmount;
            dispatch(deleteMissingProduct(missingProduct));
          }
        }
        if (data.billData.type === BillType.RETURNED_BILL) {
          if (data.action === BillRequestAction.ADD_BILL) {
            updatedProduct.totalNumberOfUnits += billProduct.totalProductAmount;
          }
          if (data.action === BillRequestAction.UPDATE_BILL) {
            updatedProduct.totalNumberOfUnits +=
              billProduct.initialProductAmount;
          }
          if (data.action === BillRequestAction.DELETE_BILL) {
            updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;
            dispatch(deleteMissingProduct(missingProduct));
          }
        }

        // THE PRODUCT IS ALREADY FOUNDED
        if (data.billData.type === BillType.PURCHASES_BILL) {
          console.log("PURCHASES BILL PRODUCT FOUNDED");
          if (data.action === BillRequestAction.ADD_BILL) {
            updatedProduct.numberOfUnits = billProduct.numberOfUnits;
            updatedProduct.priceOfPiece = billProduct.priceOfPiece;
            updatedProduct.priceOfUnit = billProduct.priceOfUnit;
            //prettier-ignore
            updatedProduct.totalNumberOfUnits += billProduct.totalProductAmount * billProduct.numberOfUnits;
          }
        }
        //prettier-ignore
        updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
        //prettier-ignore
        updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

        // UPDATE STOCK WHEN THE PRODUCT IS FOUND
        updateData({
          collectionName: COLLECTIONS.STOCK,
          docId: updatedProduct.id,
          newData: updatedProduct,
        });
      } else {
        if (data.billData.type === BillType.PURCHASES_BILL) {
          // ADD NEW ITEM TO STOCK WHEN THE PRODUCT IS NOT FOUND
          console.log("PURCHASES BILL PRODUCT NOT FOUNDED");
          console.log("ADD NEW ITEM TO STOCK");
          // ADD TO STOCK
          // sendData({
          //   collectionName: COLLECTIONS.STOCK,
          //   data: {},
          // });
          // REMOVE FROM MISSING
          // deleteData({
          //   collectionName: COLLECTIONS.MISSING,
          //   data: {},
          // });
        }
      }

      return updatedProduct;
    });

    //prettier-ignore
    dispatch(stockActions.updateStockProductsFromBill({updatedStockProducts: updatedStockData}));
  };

export default stockSlice.reducer;
