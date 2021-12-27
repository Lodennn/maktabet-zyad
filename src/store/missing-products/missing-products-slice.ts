import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { HttpInitialState } from "../../interfaces/index";
import { readData, sendData, deleteData } from "../../services/api";
import { AppDispatch } from "../index";
import { MissingProductsDoc, StockDoc } from "../../interfaces/database";

const initialState: HttpInitialState<MissingProductsDoc> = {
  isLoading: false,
  error: null,
  data: [],
};

const missingProductsSlice = createSlice({
  name: "missing-products",
  initialState,
  reducers: {
    fetchingMissingProductsData(state, action) {
      state.isLoading = true;
    },
    errorMissingProductsData(state, action) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    addMissingProductsData(state, action) {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const missingProductsActions = missingProductsSlice.actions;

export const addMissingProductsDataToStore =
  () => async (dispatch: AppDispatch) => {
    dispatch(missingProductsActions.fetchingMissingProductsData({}));
    try {
      const missingProductsData = await readData(COLLECTIONS.MISSING_PRODUCTS);
      dispatch(
        missingProductsActions.addMissingProductsData({
          data: missingProductsData,
        })
      );
    } catch (err) {
      dispatch(missingProductsActions.errorMissingProductsData({}));
    }
  };

export const insertMissingProduct =
  (insertData: MissingProductsDoc) => async (dispatch: AppDispatch) => {
    console.log("insertMissingProduct NORMAL BILL", insertData);
    const data = {
      collectionName: COLLECTIONS.MISSING_PRODUCTS,
      data: insertData,
    };
    await sendData(data);
  };

export const deleteMissingProduct =
  (missingProduct: MissingProductsDoc) =>
  async (dispatch: AppDispatch, getState: any) => {
    console.log("deleteMissingProduct NORMAL BILL");
    const stateData = [...getState().missingProducts.data];
    //prettier-ignore
    const onDeleteMissingProduct = await stateData.find((state: MissingProductsDoc) => state.productName === missingProduct.productName);

    console.log("missingProduct: ", missingProduct, onDeleteMissingProduct);

    if (!!onDeleteMissingProduct) {
      const data = {
        collectionName: COLLECTIONS.MISSING_PRODUCTS,
        docId: onDeleteMissingProduct.id,
      };

      await deleteData(data);
    }
  };

export default missingProductsSlice.reducer;
