import { useEffect, useReducer, useState } from "react";
import { CRUDRequest } from "../constants";
import { BillsDoc, StockDoc } from "../interfaces";
import { BillType } from "../types/bills";

export interface PurchaseBillConfigInitialState {
  searchedProduct: StockDoc;
  searchedProductAmount: number;
  searchedProductPiecePrice: number;
  searchedProductNumberOfUnits: number;
  searchedProductUnitPrice: number;
  // UPDATE REASONS
  // searchedProductOldAmount: number;
  // searchedUpdatedProductAmount: number;
  // initialProductAmount: number;
}

type PurchaseBillActionType = {
  type: string;
  payload: { data: any };
};

const initialState: PurchaseBillConfigInitialState = {
  searchedProduct: {} as StockDoc,
  searchedProductAmount: 1,
  searchedProductPiecePrice: 0,
  searchedProductNumberOfUnits: 0,
  searchedProductUnitPrice: 0,
  // UPDATE REASONS
  // searchedProductOldAmount: 0,
  // searchedUpdatedProductAmount: 0,
  // initialProductAmount: 0,
};

const reducerFn = (
  state: PurchaseBillConfigInitialState = initialState,
  action: PurchaseBillActionType
) => {
  if (action.type === "SET_SEARCHED_PRODUCT") {
    return {
      ...state,
      searchedProduct: action.payload.data,
    };
  }
  if (action.type === "CHANGE_PRODUCT_AMOUNT") {
    return {
      ...state,
      searchedProductAmount: action.payload.data,
    };
  }
  if (action.type === "CHANGE_UNITS_NUMBER") {
    return {
      ...state,
      searchedProductNumberOfUnits: action.payload.data,
    };
  }
  if (action.type === "CHANGE_PIECE_PRICE") {
    return {
      ...state,
      searchedProductPiecePrice: action.payload.data,
    };
  }
  if (action.type === "CHANGE_UNIT_PRICE") {
    return {
      ...state,
      searchedProductUnitPrice: action.payload.data,
    };
  }
  return state;
};

const useBillProducts = (
  dispatchBillActions: Function,
  removeNewBillProduct: Function
) => {
  const [billProductsConfig, dispatchBillConfigActions] = useReducer(
    reducerFn,
    initialState
  );
  const getSearchValue = (searchedProduct: StockDoc) => {
    const updatedSearchedProductData: any = {
      id: searchedProduct.id,
      productName: searchedProduct.productName,
      category: searchedProduct.category,
      totalProductAmount: 1,
      totalNumberOfUnits: searchedProduct.totalNumberOfUnits,
      priceOfUnit: searchedProduct.priceOfUnit,
    };

    dispatchBillConfigActions({
      type: "SET_SEARCHED_PRODUCT",
      payload: { data: { ...searchedProduct, totalProductAmount: 1 } },
    });

    //prettier-ignore
    dispatchBillActions({ type: "ADD_PRODUCT", payload: {data: updatedSearchedProductData} });
  };

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
      priceOfUnit: searchedProduct.priceOfUnit,
      // FOR UPDATE REASONS
      // oldProductAmount: 0,
      // updatedProductAmount: 0,
      // initialProductAmount: 0,
    };

    // if (crudID === CRUDRequest.UPDATE) {
    //   updatedSearchedProductData.oldProductAmount =
    //     searchedProduct.totalProductAmount;
    //   updatedSearchedProductData.updatedProductAmount = targetValue;
    // }

    if (targetValue > billProductsConfig.searchedProduct.totalNumberOfUnits)
      return;

    dispatchBillConfigActions({
      type: "CHANGE_PRODUCT_AMOUNT",
      payload: { data: targetValue },
    });

    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  const removeProductFromBill = (searchedProduct: StockDoc) => {
    removeNewBillProduct();

    const updatedSearchedProductData = {
      id: searchedProduct.id,
      category: searchedProduct.category,
      numberOfUnits: searchedProduct.numberOfUnits,
      priceOfPiece: searchedProduct.priceOfPiece,
      priceOfUnit: searchedProduct.priceOfUnit,
      productName: searchedProduct.productName,
      totalProductAmount: billProductsConfig.searchedProductAmount,
    };

    //prettier-ignore
    dispatchBillActions({ type: "REMOVE_PRODUCT", payload: {data: updatedSearchedProductData} });
  };

  return {
    billProductsConfig,
    getSearchValue,
    onChangeProductAmountHandler,
    removeProductFromBill,
  };
};

export default useBillProducts;
