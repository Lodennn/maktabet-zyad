import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { deleteData, readData, sendData, updateData } from "../../services/api";
import { AppDispatch } from "../index";
import { BillsInitialState } from "../../interfaces/redux-store";
import {
  BillsDoc,
  DeleteRequestData,
  SendRequestData,
  StockDoc,
  UpdateRequestData,
} from "../../interfaces";
import { dateMe, resetDate } from "../../helpers/functions";
import { BillType } from "../../types/bills";
import { addStockDataToStore } from "../stock/stock-slice";

const initialState: BillsInitialState = {
  isLoading: false,
  error: null,
  data: [],
  billSelectedProducts: [],
  dailyBills: [],
  dailyBillsTotal: 0,
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
      state.dailyBillsTotal = state.dailyBills.reduce((acc, cur) => {
        if (cur.type === BillType.NORMAL_BILL) {
          return acc + cur.total;
        } else {
          return acc - cur.total;
        }
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
    addBill(state, action) {
      state.data = state.data.concat(action.payload.data);
      state.dailyBills = state.data.filter(
        (billProduct) =>
          resetDate(dateMe(billProduct.createdAt)) === resetDate(new Date())
      );
    },
    deleteBill(state, action) {
      state.data = state.data.filter(
        (bill: BillsDoc) => bill.id !== action.payload.data.id
      );
      state.dailyBills = state.data.filter(
        (billProduct) =>
          resetDate(dateMe(billProduct.createdAt)) === resetDate(new Date())
      );
    },
    updateBill(state, action) {
      const updatedBillIndex = state.data.findIndex(
        (bill: BillsDoc) => bill.id === action.payload.data.id
      );
      state.data[updatedBillIndex] = action.payload.data;
      state.dailyBills = state.data.filter(
        (billProduct) =>
          resetDate(dateMe(billProduct.createdAt)) === resetDate(new Date())
      );
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

export const insertBill =
  (billData: BillsDoc) => async (dispatch: AppDispatch) => {
    try {
      // INSERT BILL TO DATABASE
      await sendData({
        collectionName: COLLECTIONS.BILLS,
        data: billData,
      } as SendRequestData).then((_) => {
        dispatch(addStockDataToStore());
        dispatch(billsActions.addBill({ data: billData }));
      });
    } catch (err) {
      console.error(err);
    }
  };

export const updateBill =
  (billData: BillsDoc) => async (dispatch: AppDispatch) => {
    try {
      // INSERT BILL TO DATABASE
      await updateData({
        collectionName: COLLECTIONS.BILLS,
        docId: billData.id,
        newData: billData,
      } as UpdateRequestData).then((_) => {
        dispatch(addStockDataToStore());
        dispatch(billsActions.updateBill({ data: billData }));
      });
    } catch (err) {
      console.error(err);
    }
  };

export const deleteBill =
  (billData: BillsDoc) => async (dispatch: AppDispatch) => {
    try {
      // INSERT BILL TO DATABASE
      await deleteData({
        collectionName: COLLECTIONS.BILLS,
        docId: billData.id,
      } as DeleteRequestData).then((_) => {
        dispatch(addStockDataToStore());
        dispatch(billsActions.deleteBill({ data: billData }));
      });
    } catch (err) {
      console.error(err);
    }
  };

export default billsSlice.reducer;
