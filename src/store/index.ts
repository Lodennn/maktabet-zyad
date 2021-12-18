import { configureStore } from "@reduxjs/toolkit";
import missingProductsReducer from "./missing-products/missing-products-slice";
import purchasesReducer from "./purchases/purchases-slice";
import StockReducer from "./stock/stock-slice/stock-slice";

const store = configureStore({
  reducer: {
    stock: StockReducer,
    missingProducts: missingProductsReducer,
    purchases: purchasesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
