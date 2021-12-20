import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { HttpInitialState } from "../../interfaces/index";
import { readData } from "../../services/api";
import { AppDispatch } from "../index";
import { PurchasesDoc } from "../../interfaces/database";
import { BillsInitialState } from "../../interfaces/redux-store";
import { StockDoc } from "../../interfaces/database";

const initialState: BillsInitialState = {
  isLoading: false,
  error: null,
  data: [],
  billSelectedProducts: [],
  total: 0,
};

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    fetchingPurchasesData(state, action) {
      state.isLoading = true;
    },
    errorPurchasesData(state, action) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    addPurchasesData(state, action) {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    updateBillProducts(state, action) {
      console.log("updateBillProducts: ", action.payload.selectedProduct);
      const searchedProductIndex = state.billSelectedProducts.findIndex(
        (searchedProduct) =>
          searchedProduct.id === action.payload.selectedProduct.id
      );

      let updatedBillProducts: StockDoc[] = [];

      if (searchedProductIndex >= 0) {
        updatedBillProducts = [...state.billSelectedProducts];
        state.billSelectedProducts[searchedProductIndex].priceOfPiece =
          action.payload.selectedProduct.priceOfPiece;
      } else {
        state.billSelectedProducts = state.billSelectedProducts.concat(
          action.payload.selectedProduct
        );
        updatedBillProducts = [...state.billSelectedProducts];
      }

      state.total = updatedBillProducts.reduce((acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      }, 0);
    },
    addProductToBill(state, action) {
      const searchedProductIndex = state.billSelectedProducts.findIndex(
        (searchedProduct) =>
          searchedProduct.id === action.payload.selectedProduct.id
      );

      let updatedBillProducts: StockDoc[] = [];

      if (searchedProductIndex >= 0) {
        updatedBillProducts = [...state.billSelectedProducts];
        state.billSelectedProducts[searchedProductIndex].totalProductAmount =
          action.payload.selectedProduct.totalProductAmount;
      } else {
        state.billSelectedProducts = state.billSelectedProducts.concat(
          action.payload.selectedProduct
        );
        updatedBillProducts = [...state.billSelectedProducts];
      }

      state.total = updatedBillProducts.reduce((acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      }, 0);
    },
    removeProductFromBill(state, action) {
      state.billSelectedProducts = state.billSelectedProducts.filter(
        (billProduct) => billProduct.id !== action.payload.selectedProduct.id
      );

      state.total = state.billSelectedProducts.reduce((acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      }, 0);
    },
  },
});

export const purchasesActions = purchasesSlice.actions;

export const addPurchasesDataToStore = () => async (dispatch: AppDispatch) => {
  dispatch(purchasesActions.fetchingPurchasesData({}));
  try {
    const purchasesData = await readData(COLLECTIONS.PURCHASES);
    dispatch(purchasesActions.addPurchasesData({ data: purchasesData }));
  } catch (err) {
    dispatch(purchasesActions.errorPurchasesData({}));
  }
};

export default purchasesSlice.reducer;
