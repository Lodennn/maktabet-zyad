import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { HttpInitialState } from "../../interfaces/index";
import { readData } from "../../services/api";
import { AppDispatch } from "../index";
import { PurchasesDoc } from "../../interfaces/database";
const initialState: HttpInitialState<PurchasesDoc> = {
  isLoading: false,
  error: null,
  data: [],
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
