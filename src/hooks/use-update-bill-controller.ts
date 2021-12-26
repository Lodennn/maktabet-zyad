import { useReducer } from "react";
import { CRUDRequest } from "../constants";
import { StockDoc } from "../interfaces";
import { BillType } from "../types/bills";

export interface PurchaseBillInitialState {
  billSelectedProducts: StockDoc[];
  billTotal: number;
}

type PurchaseBillActionType = {
  type: string;
  payload: { data: any };
};

const useUpdateBillController = () => {
  const initialState: PurchaseBillInitialState = {
    billSelectedProducts: [],
    billTotal: 0,
  };

  const reducerFn = (
    state: PurchaseBillInitialState = initialState,
    action: PurchaseBillActionType
  ) => {
    if (action.type === "UPDATE_BILL") {
      //prettier-ignore
      return {
        ...state,
        billSelectedProducts: action.payload.data.products,
        billTotal: action.payload.data.total,
      };
    }
    if (action.type === "ADD_PRODUCT") {
      const searchedProductIndex = [...state.billSelectedProducts].findIndex(
        (searchedProduct) => searchedProduct.id === action.payload.data.id
      );

      let updatedBillProducts: StockDoc[] = [];

      if (searchedProductIndex >= 0) {
        updatedBillProducts = [...state.billSelectedProducts];
        //prettier-ignore

        //prettier-ignore
        updatedBillProducts[searchedProductIndex] = action.payload.data
      } else {
        updatedBillProducts = state.billSelectedProducts.concat(
          action.payload.data
        );
      }

      const updatedBillTotal = updatedBillProducts.reduce((acc, cur) => {
        return acc + cur.priceOfUnit * cur.totalProductAmount!;
      }, 0);

      return {
        billSelectedProducts: updatedBillProducts,
        billTotal: updatedBillTotal,
      };
      // const updatedState = { ...state, searchedProduct: action.payload.data, billProducts };
    }
    if (action.type === "REMOVE_PRODUCT") {
      let updatedBillProducts = state.billSelectedProducts.filter(
        (billProduct) => billProduct.id !== action.payload.data.id
      );

      let updatedBillTotal = updatedBillProducts.reduce((acc, cur) => {
        return acc + cur.priceOfUnit * cur.totalProductAmount!;
      }, 0);

      return {
        billSelectedProducts: updatedBillProducts,
        billTotal: updatedBillTotal,
      };
    }

    return state;
  };
  const [billProductsData, dispatchBillActions] = useReducer(
    reducerFn,
    initialState
  );

  return { billProductsData, dispatchBillActions };
};

export default useUpdateBillController;
