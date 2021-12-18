import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../../constants";
import { HttpInitialState, StockDoc } from "../../../interfaces/index";
import { readData } from "../../../services/api";
import { AppDispatch } from "../../index";

const initialState: HttpInitialState<StockDoc> = {
  isLoading: false,
  error: null,
  data: [],
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
      state.isLoading = false;
      state.error = null;
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

export default stockSlice.reducer;
