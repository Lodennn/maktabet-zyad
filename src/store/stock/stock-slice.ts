import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { StockDoc } from "../../interfaces";
import { StockInitialState } from "../../interfaces/redux-store";
import { readData, updateData } from "../../services/api";
import { BillType } from "../../types/bills";
import { AppDispatch } from "../index";

const initialState: StockInitialState = {
  isLoading: false,
  error: null,
  data: [],
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
      state.filteredStockData = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    filterStockData(state, action) {
      let tempStockData = [...state.data];
      tempStockData = tempStockData.filter((data) =>
        data.productName.includes(action.payload.searchValue)
      );
      state.filteredStockData = tempStockData;
    },
    updateStockProductsFromBill(state, action) {
      console.log("updateStockProductsFromBill()");
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
  (billData: any) => async (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];

    const updatedStockData = billData.products.map((billProduct: any) => {
      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) => stockProduct.id === billProduct.id
      );

      let updatedProduct: StockDoc = {} as StockDoc;
      //prettier-ignore
      if (billData.type !== BillType.PURCHASES_BILL && stockProductInBillIndex >= 0) {

        updatedProduct = {...stockData[stockProductInBillIndex]};
        //prettier-ignore
        updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;
        //prettier-ignore
        updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
        //prettier-ignore
        updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;
      }

      console.log("updatedProduct: ", updatedProduct);

      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });

      return updatedProduct;
    });

    //prettier-ignore

    return updatedStockData;
  };

export default stockSlice.reducer;
