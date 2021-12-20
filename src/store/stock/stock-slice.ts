import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { StockInitialState } from "../../interfaces/redux-store";
import { readData } from "../../services/api";
import { AppDispatch } from "../index";

const initialState: StockInitialState = {
  isLoading: false,
  error: null,
  data: [],
  filteredStockData: [],
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
      state.filteredStockData = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    filterStockData(state, action) {
      let tempStockData = [...state.data];
      tempStockData = tempStockData.filter((data) =>
        data.productName.includes(action.payload.searchValue)
      );
      state.filteredStockData = tempStockData;
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
