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
        const stockProductIndex = state.data.findIndex((stockProduct: StockDoc) => stockProduct.productName === billProduct.productName);
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
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );
      const stockProductInBill = stockData.find(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
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
            updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;
            if (updatedProduct.totalNumberOfUnits <= 0) {
              //prettier-ignore
              dispatch(insertMissingProduct(missingProduct));
            }
          }
          if (data.action === BillRequestAction.UPDATE_BILL) {
            if (!!billProduct.oldProductAmount) {
              //prettier-ignore
              if (billProduct.totalProductAmount > billProduct.oldProductAmount) {
                //prettier-ignore
                updatedProduct.totalNumberOfUnits -= billProduct.initialProductAmount;
                if (updatedProduct.totalNumberOfUnits <= 0) {
                  //prettier-ignore
                  dispatch(insertMissingProduct(missingProduct));
                }
              } else {
                //prettier-ignore
                updatedProduct.totalNumberOfUnits += billProduct.initialProductAmount;      
                if (billProduct.totalProductAmount < billProduct.totalNumberOfUnits) {
                  //prettier-ignore
                  dispatch(deleteMissingProduct(missingProduct));
                }
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
            dispatch(deleteMissingProduct(missingProduct));
          }
          if (data.action === BillRequestAction.UPDATE_BILL) {
            updatedProduct.totalNumberOfUnits +=
              billProduct.initialProductAmount;
            dispatch(deleteMissingProduct(missingProduct));
          }
          if (data.action === BillRequestAction.DELETE_BILL) {
            updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;
            if (updatedProduct.totalNumberOfUnits <= 0) {
              //prettier-ignore
              dispatch(insertMissingProduct(missingProduct));
            }
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
            dispatch(deleteMissingProduct(missingProduct));
          }
          if (data.action === BillRequestAction.UPDATE_BILL) {
            if (!!billProduct.oldProductAmount) {
              const {
                priceOfPiece,
                priceOfUnit,
                numberOfUnits,
                totalProductAmount,
              } = billProduct;

              let profitOfPieceEquation,
                profitOfUnitEquation,
                totalProfitEquation,
                profitPercentEquation;
              //
              const newProduct: StockDoc = {
                ...updatedProduct,
              };

              console.log("billProduct: ", billProduct);
              console.log("updatedProduct: ", updatedProduct);

              //prettier-ignore
              if((billProduct.totalProductAmount*billProduct.numberOfUnits) > billProduct.oldProductAmount) {
                console.log('TEST.')
                newProduct.numberOfPieces += billProduct.totalProductAmount;
                //prettier-ignore
                newProduct.totalNumberOfUnits = (updatedProduct.totalNumberOfUnits - billProduct.oldProductAmount) + (billProduct.totalProductAmount * billProduct.numberOfUnits)
              }

              //prettier-ignore
              if((billProduct.totalProductAmount*billProduct.numberOfUnits) < billProduct.oldProductAmount) {
                newProduct.numberOfPieces -= billProduct.totalProductAmount;
                console.log('ELSE TEST.')
                //prettier-ignore
                newProduct.totalNumberOfUnits = (updatedProduct.totalNumberOfUnits - billProduct.oldProductAmount) + (billProduct.totalProductAmount * billProduct.numberOfUnits)
              }

              if (billProduct.category !== updatedProduct.category) {
                console.log("1.");
                newProduct.category = billProduct.category;
              }
              //prettier-ignore
              // if(billProduct.numberOfPieces !== updatedProduct.numberOfPieces) {
              //   console.log('2.')
              //   newProduct.numberOfPieces += billProduct.totalProductAmount;
              // }
              //prettier-ignore
              // if((billProduct.totalProductAmount*billProduct.numberOfUnits) !== updatedProduct.totalNumberOfUnits) {
              //   console.log('2.')
              //     newProduct.numberOfPieces += billProduct.totalProductAmount;
              //     //prettier-ignore
              //     newProduct.totalNumberOfUnits = Math.abs(updatedProduct.totalNumberOfUnits + (billProduct.totalProductAmount - updatedProduct.numberOfPieces) * billProduct.numberOfUnits);
              //   }
              //prettier-ignore
              if(billProduct.priceOfPiece !== updatedProduct.priceOfPiece) {
                console.log('3.')
                  newProduct.priceOfPiece = billProduct.priceOfPiece;
                }
              //prettier-ignore
              if(billProduct.numberOfUnits !== updatedProduct.numberOfUnits) {
                console.log('4.')
                  newProduct.numberOfUnits = billProduct.numberOfUnits;
                }
              //prettier-ignore
              if(billProduct.priceOfUnit !== updatedProduct.priceOfUnit) {
                console.log('5.')
                  newProduct.priceOfUnit = billProduct.priceOfUnit;
                }
              //
              profitOfPieceEquation =
                (100 * (priceOfUnit * numberOfUnits - priceOfPiece)) /
                priceOfPiece;
              //
              profitOfUnitEquation =
                (100 * (priceOfUnit - priceOfPiece / numberOfUnits)) /
                (priceOfPiece / numberOfUnits);
              //
              totalProfitEquation =
                (priceOfUnit * numberOfUnits - priceOfPiece) *
                totalProductAmount;
              //
              profitPercentEquation =
                ((totalProfitEquation - data.billData.total) /
                  data.billData.total) *
                100;
              newProduct.profitOfPiece = profitOfPieceEquation;
              newProduct.profitOfUnit = profitOfUnitEquation;
              newProduct.totalProfit = totalProfitEquation;
              newProduct.profitPercent = profitPercentEquation;
              //prettier-ignore
              newProduct.remainingAmountOfPieces = Math.abs(newProduct.totalNumberOfUnits / newProduct.numberOfUnits);
              //prettier-ignore
              newProduct.remainingAmountOfUnits = Math.abs(newProduct.totalNumberOfUnits % newProduct.numberOfUnits);

              console.log("newProduct: ", newProduct);

              //prettier-ignore
              // if(billProduct.totalProductAmount * billProduct.numberOfUnits > updatedProduct.totalNumberOfUnits) {
              //   console.log('THIS BULL HAS MORE THAN BEFORE')
              // } else {
              //   console.log('THIS BULL HAS LESS THAN BEFORE')
              // }
              updatedProduct = newProduct;
            }
          }
          if (data.action === BillRequestAction.DELETE_BILL) {
            const isProductFreshInStock =
              billProduct.totalProductAmount * billProduct.numberOfUnits ===
              updatedProduct.totalNumberOfUnits;
            if (isProductFreshInStock) {
              deleteData({
                collectionName: COLLECTIONS.STOCK,
                docId: updatedProduct.id!,
              });
            } else {
              updatedProduct.totalNumberOfUnits -=
                billProduct.totalProductAmount * billProduct.numberOfUnits;
            }
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
        // NOT FOUNDED PRODUCT
        if (data.billData.type === BillType.PURCHASES_BILL) {
          if (data.action === BillRequestAction.DELETE_BILL) {
            console.log("DELETE NOT FOUNDED BILL");
          }
          if (data.action === BillRequestAction.ADD_BILL) {
            // ADD NEW ITEM TO STOCK WHEN THE PRODUCT IS NOT FOUND

            const {
              priceOfPiece,
              priceOfUnit,
              numberOfPieces,
              numberOfUnits,
              totalProductAmount,
            } = billProduct;
            //
            const profitOfPieceEquation =
              (100 * (priceOfUnit * numberOfUnits - priceOfPiece)) /
              priceOfPiece;
            //
            const profitOfUnitEquation =
              (100 * (priceOfUnit - priceOfPiece / numberOfUnits)) /
              (priceOfPiece / numberOfUnits);
            //
            const totalProfitEquation =
              (priceOfUnit * numberOfUnits - priceOfPiece) * totalProductAmount;
            //
            const profitPercentEquation =
              ((totalProfitEquation - data.billData.total) /
                data.billData.total) *
              100;

            const newProduct: StockDoc = {
              ...billProduct,
              // MAYBE DELETE
              numberOfPieces: totalProductAmount,
              profitOfPiece: profitOfPieceEquation,
              profitOfUnit: profitOfUnitEquation,
              // MAYBE DELETE
              profitPercent: profitPercentEquation,
              // MAYBE DELETE
              purchasingCosts: data.billData.total,
              remainingAmountOfPieces: totalProductAmount,
              remainingAmountOfUnits: 0,
              totalNumberOfUnits: totalProductAmount * numberOfUnits,
              totalProductAmount: 1,
              totalProfit: totalProfitEquation,
            };
            console.log("new Product", newProduct);
            // ADD TO STOCK
            sendData({
              collectionName: COLLECTIONS.STOCK,
              data: newProduct,
            });
          }
        }
      }

      return updatedProduct;
    });

    //prettier-ignore
    dispatch(stockActions.updateStockProductsFromBill({updatedStockProducts: updatedStockData}));
  };

export default stockSlice.reducer;
