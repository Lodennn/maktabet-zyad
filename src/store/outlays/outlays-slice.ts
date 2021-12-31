import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import { HttpInitialState } from "../../interfaces/index";
import { readData, sendData, deleteData } from "../../services/api";
import { AppDispatch } from "../index";
import { OutlaysDoc } from "../../interfaces/database";

const initialState: HttpInitialState<OutlaysDoc> = {
  isLoading: false,
  error: null,
  data: [],
};

const outlaysSlice = createSlice({
  name: "missing-products",
  initialState,
  reducers: {
    fetchingOutlaysData(state, action) {
      state.isLoading = true;
    },
    errorOutlaysData(state, action) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    addOutlaysData(state, action) {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    addOutlay(state, action) {
      state.data = state.data.concat(action.payload.data);
    },
  },
});

export const outlaysActions = outlaysSlice.actions;

export const addOutlays = () => async (dispatch: AppDispatch) => {
  dispatch(outlaysActions.fetchingOutlaysData({}));
  try {
    const outlaysData = await readData(COLLECTIONS.OUTLAYS);
    dispatch(
      outlaysActions.addOutlaysData({
        data: outlaysData,
      })
    );
  } catch (err) {
    dispatch(outlaysActions.errorOutlaysData({}));
  }
};

export const insertOutlay =
  (insertData: OutlaysDoc) => async (dispatch: AppDispatch) => {
    const data = {
      collectionName: COLLECTIONS.OUTLAYS,
      data: insertData,
    };
    await sendData(data).then((_) =>
      dispatch(outlaysActions.addOutlay(insertData))
    );
  };

export const deleteOutlay =
  (missingProduct: OutlaysDoc) =>
  async (dispatch: AppDispatch, getState: any) => {
    const stateData = [...getState().missingProducts.data];
    //prettier-ignore
  };

export default outlaysSlice.reducer;
