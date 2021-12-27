import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { readData } from "../../services/api";
import { AppDispatch } from "../index";
import { BillsInitialState } from "../../interfaces/redux-store";
import { StockDoc } from "../../interfaces";
import { dateMe, resetDate } from "../../helpers/functions";

const initialState: BillsInitialState = {
  isLoading: false,
  error: null,
  data: [],
  billSelectedProducts: [],
  dailyBills: [],
  total: 0,
};

const billsSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    fetchingBillsData(state, action) {
      state.isLoading = true;
    },
    errorBillsData(state, action) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    addBillsData(state, action) {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
      state.dailyBills = state.data.filter(
        (billProduct) =>
          resetDate(dateMe(billProduct.createdAt)) === resetDate(new Date())
      );
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
        return acc + cur.priceOfUnit * cur.totalProductAmount!;
      }, 0);
    },
    removeProductFromBill(state, action) {
      state.billSelectedProducts = state.billSelectedProducts.filter(
        (billProduct) => billProduct.id !== action.payload.selectedProduct.id
      );

      state.total = state.billSelectedProducts.reduce((acc, cur) => {
        return acc + cur.priceOfUnit * cur.totalProductAmount!;
      }, 0);
    },
  },
});

export const billsActions = billsSlice.actions;

export const addBillsData = () => async (dispatch: AppDispatch) => {
  dispatch(billsActions.fetchingBillsData({}));
  try {
    const billsData = await readData(COLLECTIONS.BILLS);
    dispatch(billsActions.addBillsData({ data: billsData }));
  } catch (err) {
    dispatch(billsActions.errorBillsData({}));
  }
};

export default billsSlice.reducer;
