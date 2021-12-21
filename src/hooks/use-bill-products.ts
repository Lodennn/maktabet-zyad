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
    const updatedSearchedProductData = {
      ...searchedProduct,
      // priceOfPiece: billProductsConfig.searchedProductPiecePrice,
      totalProductAmount: 1,
    };
    if (
      billType === BillType.NORMAL_BILL ||
      billType === BillType.RETURNED_BILL
    ) {
      updatedSearchedProductData.priceOfPiece = searchedProduct.priceOfPiece;
    } else if (billType === BillType.PURCHASES_BILL) {
      updatedSearchedProductData.priceOfPiece =
        billProductsConfig.searchedProductPiecePrice;
    }
    dispatchBillConfigActions({
      type: "SET_SEARCHED_PRODUCT",
      payload: { data: updatedSearchedProductData },
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

    const updatedSearchedProductData = {
      ...searchedProduct,
      totalProductAmount: targetValue,
      // priceOfPiece: billProductsConfig.searchedProductPiecePrice,
      //prettier-ignore
      numberOfPieces: searchedProduct.numberOfPieces + billProductsConfig.searchedProductAmount,
      numberOfUnits: billProductsConfig.searchedProductNumberOfUnits,
      priceOfUnit: billProductsConfig.searchedProduct.priceOfUnit,
    };
    if (
      billType === BillType.NORMAL_BILL ||
      billType === BillType.RETURNED_BILL
    ) {
      updatedSearchedProductData.priceOfPiece = searchedProduct.priceOfPiece;
    } else if (billType === BillType.PURCHASES_BILL) {
      updatedSearchedProductData.priceOfPiece =
        billProductsConfig.searchedProductPiecePrice;
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
    const updatedSearchedProductData = {
      ...searchedProduct,
      totalProductAmount: billProductsConfig.searchedProductAmount,
      //prettier-ignore
      numberOfPieces: searchedProduct.numberOfPieces + billProductsConfig.searchedProductAmount,
      numberOfUnits: billProductsConfig.searchedProductNumberOfUnits,
      priceOfUnit: billProductsConfig.searchedProduct.priceOfUnit,
      priceOfPiece: targetValue,
    };
    if (
      billType === BillType.NORMAL_BILL ||
      billType === BillType.RETURNED_BILL
    ) {
      updatedSearchedProductData.priceOfPiece = searchedProduct.priceOfPiece;
    } else if (billType === BillType.PURCHASES_BILL) {
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

    const updatedSearchedProductData = {
      ...searchedProduct,
      totalProductAmount: billProductsConfig.searchedProductAmount,
      //prettier-ignore
      numberOfPieces: searchedProduct.numberOfPieces + billProductsConfig.searchedProductAmount,
      // priceOfPiece: billProductsConfig.searchedProductPiecePrice,
      priceOfUnit: billProductsConfig.searchedProductUnitPrice,
      numberOfUnits: targetValue,
    };
    if (
      billType === BillType.NORMAL_BILL ||
      billType === BillType.RETURNED_BILL
    ) {
      updatedSearchedProductData.priceOfPiece = searchedProduct.priceOfPiece;
    } else if (billType === BillType.PURCHASES_BILL) {
      updatedSearchedProductData.priceOfPiece =
        billProductsConfig.searchedProductPiecePrice;
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

    const updatedSearchedProductData = {
      ...searchedProduct,
      totalProductAmount: billProductsConfig.searchedProductAmount,
      //prettier-ignore
      numberOfPieces: searchedProduct.numberOfPieces + billProductsConfig.searchedProductAmount,
      // priceOfPiece: billProductsConfig.searchedProductPiecePrice,
      numberOfUnits: billProductsConfig.searchedProductNumberOfUnits,
      priceOfUnit: targetValue,
    };
    if (
      billType === BillType.NORMAL_BILL ||
      billType === BillType.RETURNED_BILL
    ) {
      updatedSearchedProductData.priceOfPiece = searchedProduct.priceOfPiece;
    } else if (billType === BillType.PURCHASES_BILL) {
      updatedSearchedProductData.priceOfPiece =
        billProductsConfig.searchedProductPiecePrice;
    }
    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  const removeProductFromBill = (searchedProduct: StockDoc) => {
    removeNewBillProduct();

    const updatedSearchedProductData = {
      ...searchedProduct,
      totalProductAmount: billProductsConfig.searchedProductAmount,
    };

    //prettier-ignore
    dispatchBillActions({ type: "REMOVE_PRODUCT", payload: {data: updatedSearchedProductData} });
  };

  console.log("FROM HOOK: ", billProductsConfig.searchedProduct);

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
