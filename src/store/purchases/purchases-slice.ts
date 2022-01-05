import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { deleteData, readData, sendData, updateData } from "../../services/api";
import { AppDispatch } from "../index";
import { PurchasesInitialState } from "../../interfaces/redux-store";
import { StockDoc } from "../../interfaces/database";
import { addStockDataToStore } from "../stock/stock-slice";
import {
  SendRequestData,
  PurchasesDoc,
  UpdateRequestData,
  DeleteRequestData,
} from "../../interfaces";
import { dateMe, resetDate } from "../../helpers/functions";

const initialState: PurchasesInitialState = {
  isLoading: false,
  error: null,
  data: [],
  billSelectedProducts: [],
  total: 0,
  dailyPurchases: [],
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
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
    },
    updateBillProducts(state, action) {
      const searchedProductIndex = state.billSelectedProducts.findIndex(
        (searchedProduct) =>
          searchedProduct.productName ===
          action.payload.selectedProduct.productName
      );

      let updatedBillProducts: StockDoc[] = [];

      if (searchedProductIndex >= 0) {
        updatedBillProducts = [...state.billSelectedProducts];

        const updatedBillProduct = {
          ...updatedBillProducts[searchedProductIndex],
        };

        // Update TOTAL PRODUCT AMOUNT
        updatedBillProduct.totalProductAmount =
          action.payload.selectedProduct.totalProductAmount;

        // Update PRICE OF PIECE
        updatedBillProduct.priceOfPiece =
          action.payload.selectedProduct.priceOfPiece;

        // Update NUMBER OF UNITS
        updatedBillProduct.numberOfUnits =
          action.payload.selectedProduct.numberOfUnits;

        state.billSelectedProducts[searchedProductIndex] = updatedBillProduct;

        updatedBillProducts = [...state.billSelectedProducts];
      } else {
        state.billSelectedProducts = state.billSelectedProducts.concat(
          action.payload.selectedProduct
        );
        updatedBillProducts = [...state.billSelectedProducts];
      }

      state.total = updatedBillProducts.reduce((acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      }, 0);
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
    },
    addProductToBill(state, action) {
      const searchedProductIndex = state.billSelectedProducts.findIndex(
        (searchedProduct) =>
          searchedProduct.productName ===
          action.payload.selectedProduct.productName
      );

      let updatedBillProducts: StockDoc[] = [];

      if (searchedProductIndex >= 0) {
        updatedBillProducts = [...state.billSelectedProducts];
        state.billSelectedProducts[searchedProductIndex].totalProductAmount =
          action.payload.selectedProduct.totalProductAmount;

        state.billSelectedProducts[searchedProductIndex].numberOfPieces +=
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
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
    },
    removeProductFromBill(state, action) {
      state.billSelectedProducts = state.billSelectedProducts.filter(
        (billProduct) =>
          billProduct.productName !== action.payload.selectedProduct.productName
      );

      state.total = state.billSelectedProducts.reduce((acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      }, 0);
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
    },
    addPurchaseBill(state, action) {
      state.data = state.data.concat(action.payload.data);
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
    },
    deletePurchaseBill(state, action) {
      state.data = state.data.filter((bill: PurchasesDoc) => {
        return bill.id !== action.payload.data.id;
      });
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
    },
    updatePurchaseBill(state, action) {
      const updatedBillIndex = state.data.findIndex(
        (bill: PurchasesDoc) => bill.id === action.payload.data.id
      );
      state.data[updatedBillIndex] = action.payload.data;
      state.dailyPurchases = state.data.filter(
        (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(new Date())
      );
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

export const updatePurchaseBillToStore =
  (purchaseBillData: PurchasesDoc) => async (dispatch: AppDispatch) => {
    try {
      await updateData({
        collectionName: COLLECTIONS.PURCHASES,
        docId: purchaseBillData.id,
        newData: purchaseBillData,
      } as UpdateRequestData).then((_) => {
        dispatch(addStockDataToStore());
        dispatch(
          purchasesActions.updatePurchaseBill({ data: purchaseBillData })
        );
      });
    } catch (err) {
      console.error(err);
    }
  };

export const deletePurchaseBillFromStore =
  (purchaseBillData: PurchasesDoc) => async (dispatch: AppDispatch) => {
    try {
      // INSERT BILL TO DATABASE
      await deleteData({
        collectionName: COLLECTIONS.PURCHASES,
        docId: purchaseBillData.id,
      } as DeleteRequestData).then((_) => {
        dispatch(addStockDataToStore());
        dispatch(
          purchasesActions.deletePurchaseBill({ data: purchaseBillData })
        );
      });
    } catch (err) {
      console.error(err);
    }
  };

export const insertPurchaseBill =
  (purchaseBillData: PurchasesDoc) => async (dispatch: AppDispatch) => {
    try {
      // INSERT BILL TO DATABASE
      await sendData({
        collectionName: COLLECTIONS.PURCHASES,
        data: purchaseBillData,
      } as SendRequestData).then((purchaseBillData) => {
        dispatch(addStockDataToStore());
        dispatch(purchasesActions.addPurchaseBill({ data: purchaseBillData }));
      });
    } catch (err) {
      console.error(err);
    }
  };

export default purchasesSlice.reducer;
