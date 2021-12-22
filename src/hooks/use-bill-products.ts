import { useReducer, useState } from "react";
import { StockDoc } from "../interfaces";
import { BillType } from "../types/bills";

export interface PurchaseBillConfigInitialState {
  searchedProduct: StockDoc;
  searchedProductAmount: number;
  searchedProductPiecePrice: number;
  searchedProductNumberOfUnits: number;
  searchedProductUnitPrice: number;
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
  removeNewBillProduct: Function,
  billType: BillType
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
    };
    if (billType === BillType.PURCHASES_BILL) {
      //prettier-ignore
      updatedSearchedProductData.priceOfPiece = billProductsConfig.searchedProductPiecePrice;
      updatedSearchedProductData.numberOfUnits = searchedProduct.numberOfUnits;
      updatedSearchedProductData.priceOfUnit = searchedProduct.priceOfUnit;
    } else {
      updatedSearchedProductData.priceOfUnit = searchedProduct.priceOfUnit;
    }
    dispatchBillConfigActions({
      type: "SET_SEARCHED_PRODUCT",
      // payload: { data: { updatedSearchedProductData } },
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
    };

    if (billType === BillType.PURCHASES_BILL) {
      //prettier-ignore
      updatedSearchedProductData.numberOfUnits = billProductsConfig.searchedProductNumberOfUnits;
      //prettier-ignore
      updatedSearchedProductData.priceOfUnit = billProductsConfig.searchedProduct.priceOfUnit;
      //prettier-ignore
      updatedSearchedProductData.priceOfPiece = billProductsConfig.searchedProductPiecePrice;
    } else {
      updatedSearchedProductData.priceOfUnit = searchedProduct.priceOfUnit;

      if (targetValue > billProductsConfig.searchedProduct.totalNumberOfUnits)
        return;
    }
    dispatchBillConfigActions({
      type: "CHANGE_PRODUCT_AMOUNT",
      payload: { data: targetValue },
    });

    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  const onChangePiecePriceHandler = (
    searchedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    dispatchBillConfigActions({
      type: "CHANGE_PIECE_PRICE",
      payload: { data: targetValue },
    });
    const updatedSearchedProductData: any = {
      id: searchedProduct.id,
      productName: searchedProduct.productName,
      category: searchedProduct.category,
      totalProductAmount: billProductsConfig.searchedProductAmount,
    };

    if (billType === BillType.PURCHASES_BILL) {
      //prettier-ignore
      updatedSearchedProductData.numberOfUnits = billProductsConfig.searchedProductNumberOfUnits;
      //prettier-ignore
      updatedSearchedProductData.priceOfUnit = billProductsConfig.searchedProduct.priceOfUnit;
      updatedSearchedProductData.priceOfPiece = targetValue;
    }
    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  const onChangeNumberOfUnitsHandler = (
    searchedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    dispatchBillConfigActions({
      type: "CHANGE_UNITS_NUMBER",
      payload: { data: targetValue },
    });

    const updatedSearchedProductData: any = {
      id: searchedProduct.id,
      productName: searchedProduct.productName,
      totalProductAmount: billProductsConfig.searchedProductAmount,
      category: searchedProduct.category,
    };

    if (billType === BillType.PURCHASES_BILL) {
      //prettier-ignore
      updatedSearchedProductData.priceOfUnit = billProductsConfig.searchedProductUnitPrice;
      updatedSearchedProductData.numberOfUnits = targetValue;
      //prettier-ignore
      updatedSearchedProductData.priceOfPiece = billProductsConfig.searchedProductPiecePrice;
    }
    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  const onChangePriceOfUnit = (
    searchedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    dispatchBillConfigActions({
      type: "CHANGE_UNIT_PRICE",
      payload: { data: targetValue },
    });

    const updatedSearchedProductData: any = {
      id: searchedProduct.id,
      productName: searchedProduct.productName,
      category: searchedProduct.category,
      totalProductAmount: billProductsConfig.searchedProductAmount,
    };

    if (billType === BillType.PURCHASES_BILL) {
      //prettier-ignore
      updatedSearchedProductData.numberOfUnits = billProductsConfig.searchedProductNumberOfUnits;
      updatedSearchedProductData.priceOfUnit = targetValue;
      //prettier-ignore
      updatedSearchedProductData.priceOfPiece = billProductsConfig.searchedProductPiecePrice;
    }
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
    onChangePiecePriceHandler,
    onChangeNumberOfUnitsHandler,
    onChangePriceOfUnit,
    removeProductFromBill,
  };
};

export default useBillProducts;
