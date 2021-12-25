import { useEffect, useReducer, useState } from "react";
import { CRUDRequest } from "../constants";
import { BillsDoc, StockDoc } from "../interfaces";
import { BillType } from "../types/bills";

export interface PurchaseBillConfigInitialState {
  searchedProduct: StockDoc;
  searchedProductAmount: number;
  searchedProductOldAmount: number;
  searchedUpdatedProductAmount: number;
}

type PurchaseBillActionType = {
  type: string;
  payload: { data: any };
};

const initialState: PurchaseBillConfigInitialState = {
  searchedProduct: {} as StockDoc,
  searchedProductAmount: 1,
  searchedProductOldAmount: 0,
  searchedUpdatedProductAmount: 0,
};

const reducerFn = (
  state: PurchaseBillConfigInitialState = initialState,
  action: PurchaseBillActionType
) => {
  if (action.type === "CHANGE_UPDATED_PRODUCT_AMOUNT") {
    return {
      ...state,
      searchedProductOldAmount: action.payload.data,
      searchedUpdatedProductAmount: action.payload.data,
    };
  }
  if (action.type === "CHANGE_PRODUCT_AMOUNT") {
    return {
      ...state,
      searchedProductAmount: action.payload.data,
    };
  }

  return state;
};

const useUpdateBill = (
  dispatchBillActions: Function,
  removeNewBillProduct: Function,
  billType: BillType,
  billData?: BillsDoc,
  crudID?: CRUDRequest
) => {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // UPDATE BILL CASE =========================================
  // UPDATE BILL CASE =========================================
  useEffect(() => {
    //prettier-ignore
    if(billData && billData.id) {
      console.log('INSTANT UPDATE BILL')
      dispatchBillActions({type: "UPDATE_PRODUCT", payload: { data: billData }});
    }
  }, []);
  // UPDATE BILL CASE =========================================
  // UPDATE BILL CASE =========================================
  //////////////////////////////////////////////////////////////////////////////////////////////

  const [billProductsConfig, dispatchBillConfigActions] = useReducer(
    reducerFn,
    initialState
  );

  const onChangeProductAmountHandler = (
    searchedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    const updatedSearchedProductData: any = {
      id: searchedProduct.id,
      productName: searchedProduct.productName,
      category: searchedProduct.category,
      totalProductAmount: targetValue,
      oldProductAmount: 0,
      updatedProductAmount: searchedProduct.totalProductAmount,
    };

    //prettier-ignore
    if (billType === BillType.NORMAL_BILL || billType === BillType.RETURNED_BILL) {
        console.log('UPDATE THIS BILL', searchedProduct.totalProductAmount)
    
      updatedSearchedProductData.priceOfUnit = searchedProduct.priceOfUnit;
      if (targetValue > billProductsConfig.searchedProduct.totalNumberOfUnits)
        return;

        //prettier-ignore
        updatedSearchedProductData.oldProductAmount = searchedProduct.totalProductAmount;
        updatedSearchedProductData.updatedProductAmount = targetValue;
        //prettier-ignore
        updatedSearchedProductData.totalProductAmount = Math.abs(updatedSearchedProductData.oldProductAmount - targetValue);
    }

    console.log("updatedSearchedProductData: ", updatedSearchedProductData);
    // dispatchBillConfigActions({
    //   type: "CHANGE_PRODUCT_AMOUNT",
    //   payload: { data: targetValue },
    // });

    dispatchBillConfigActions({
      type: "CHANGE_UPDATED_PRODUCT_AMOUNT",
      payload: { data: targetValue },
    });

    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  return {
    billProductsConfig,
    onChangeProductAmountHandler,
  };
};

export default useUpdateBill;
