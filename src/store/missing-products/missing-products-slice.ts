import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { HttpInitialState } from "../../interfaces/index";
import { readData } from "../../services/api";
import { AppDispatch } from "../index";

const initialState: HttpInitialState = {
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

export const stockActions = missingProductsSlice.actions;

export const addMissingProductsDataToStore =
  () => async (dispatch: AppDispatch) => {
    dispatch(stockActions.fetchingMissingProductsData({}));
    try {
      const missingProductsData = await readData(COLLECTIONS.MISSING_PRODUCTS);
      dispatch(
        stockActions.addMissingProductsData({ data: missingProductsData })
      );
    } catch (err) {
      dispatch(stockActions.errorMissingProductsData({}));
    }
  };

export default missingProductsSlice.reducer;
