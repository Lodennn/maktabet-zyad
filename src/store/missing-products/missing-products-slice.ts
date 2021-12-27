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
    const data = {
      collectionName: COLLECTIONS.MISSING_PRODUCTS,
      data: insertData,
    };
    await sendData(data);
  };

export const deleteMissingProduct =
  (deleteData: MissingProductsDoc) =>
  async (dispatch: AppDispatch, getState: any) => {
    const stateData = [...getState().missingProducts.data];
    //prettier-ignore
    const onDeleteMissingProduct = stateData.find((state: MissingProductsDoc) => state.productName === deleteData.productName);

    console.log("onDeleteMissingProduct: ", onDeleteMissingProduct);
    // const data = {
    //   collectionName: COLLECTIONS.MISSING_PRODUCTS,
    //   docId: deleteData.id,
    // };
    // await deleteData(data);
  };

export default missingProductsSlice.reducer;
