import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { HttpInitialState } from "../../interfaces/index";
import { readData, sendData } from "../../services/api";
import { AppDispatch } from "../index";
import { MissingProductsDoc } from "../../interfaces/database";

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

export default missingProductsSlice.reducer;
