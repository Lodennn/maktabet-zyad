import React, { Fragment, useEffect, useReducer, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import { StockDoc } from "../../../../interfaces";
import { purchasesActions } from "../../../../store/purchases/purchases-slice";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./AddNewProductToPurchaseBill.module.scss";
import { PurchaseBillInitialState } from "../AddPurchaseBillModalContent";

export interface PurchaseBillConfigInitialState {
  searchedProduct: StockDoc;
  searchedProductAmount: number;
  searchedProductPiecePrice: number;
  searchedProductNumberOfUnits: number;
}

type PurchaseBillActionType = {
  type: string;
  payload: { data: any };
};

const initialState: PurchaseBillConfigInitialState = {
  searchedProduct: {} as StockDoc,
  searchedProductAmount: 1,
  searchedProductPiecePrice: 1,
  searchedProductNumberOfUnits: 1,
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
  return state;
};

const AddNewProductToPurchaseBill: React.FC<{
  productIndex: number;
  removeNewBillProduct: (productIndex: number) => void;
  firstProductInBill: number;
  billProductsData: PurchaseBillInitialState;
  dispatchBillActions: Function;
}> = (props) => {
  const { billProductsData, dispatchBillActions } = props;

  const [billProductsConfig, dispatchBillConfigActions] = useReducer(
    reducerFn,
    initialState
  );

  const dispatch = useAppDispatch();

  const getSearchValue = (searchedProduct: StockDoc) => {
    dispatchBillConfigActions({
      type: "SET_SEARCHED_PRODUCT",
      payload: { data: searchedProduct },
    });
    const NEWsearchedProductWithAmount = {
      ...searchedProduct,
      totalProductAmount: 1,
    };

    //prettier-ignore
    dispatchBillActions({ type: "ADD_PRODUCT", payload: {data: NEWsearchedProductWithAmount} });
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
      numberOfPieces: searchedProduct.numberOfPieces + targetValue,
      priceOfPiece: billProductsConfig.searchedProductPiecePrice,
      numberOfUnits: billProductsConfig.searchedProductNumberOfUnits,
    };

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
      numberOfPieces:
        searchedProduct.numberOfPieces +
        billProductsConfig.searchedProductAmount,
      numberOfUnits: billProductsConfig.searchedProductNumberOfUnits,
      priceOfPiece: targetValue,
    };

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
      numberOfPieces:
        searchedProduct.numberOfPieces +
        billProductsConfig.searchedProductAmount,
      priceOfPiece: billProductsConfig.searchedProductPiecePrice,
      numberOfUnits: targetValue,
    };

    dispatchBillActions({
      type: "ADD_PRODUCT",
      payload: { data: updatedSearchedProductData },
    });
  };

  const removeProductFromBill = (searchedProduct: StockDoc) => {
    props.removeNewBillProduct(props.productIndex);

    const searchedProductWithAmount = {
      ...searchedProduct,
      totalProductAmount: billProductsConfig.searchedProductAmount,
    };
    dispatch(
      purchasesActions.removeProductFromBill({
        selectedProduct: searchedProductWithAmount,
      })
    );
  };

  return (
    <Fragment>
      {/** PRODUCT *************************** */}
      <div className={classes["add-bill-product"]}>
        {/** PRODUCT NAME */}
        <div
          className={`${classes["add-bill-product__info"]} ${classes["add-bill-product__info--product-name"]}`}
        >
          <label
            htmlFor={`bill-product-name-${props.productIndex}`}
            className="form-label"
          >
            اسم المنتج
          </label>
          <SmartSearch getSearchValue={getSearchValue} />
        </div>
        {/** PRODUCT CATEGORY */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">نوع المنتج</label>
          {billProductsConfig.searchedProduct.id && (
            <select>
              <option>كراس</option>
              <option>قلم</option>
              <option>برايه</option>
            </select>
          )}
        </div>
        {/** PRODUCT PIECES AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">عدد القطع</label>
          {billProductsConfig.searchedProduct.id && (
            <input
              type="number"
              value={billProductsConfig.searchedProductAmount}
              onChange={onChangeProductAmountHandler.bind(
                null,
                billProductsConfig.searchedProduct
              )}
            />
          )}
        </div>
        {/** PRODUCT PIECE PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن القطعه(جمله)</label>
          {billProductsConfig.searchedProduct.id && (
            <input
              type="number"
              placeholder={billProductsConfig.searchedProduct.priceOfPiece + ""}
              id={`bill-product-amount-${props.productIndex}`}
              min={1}
              onChange={onChangePiecePriceHandler.bind(
                null,
                billProductsConfig.searchedProduct
              )}
            />
          )}
        </div>
        {/** PRODUCT UNITS AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">عدد الوحده في القطعه</label>
          {billProductsConfig.searchedProduct.id && (
            <input
              type="number"
              id={`bill-product-amount-${props.productIndex}`}
              onChange={onChangeNumberOfUnitsHandler.bind(
                null,
                billProductsConfig.searchedProduct
              )}
              min={1}
            />
          )}
        </div>
        {/** PRODUCT UNIT PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن الوحده</label>
          {billProductsConfig.searchedProduct.id && (
            <input
              type="number"
              id={`bill-product-amount-${props.productIndex}`}
              min={1}
            />
          )}
        </div>

        {/** PRODUCT REMOVE */}
        <div className={classes["add-bill-product__info"]}>
          {props.productIndex !== props.firstProductInBill && (
            <button
              type="button"
              className={classes["add-bill-product__info--remove"]}
              onClick={removeProductFromBill.bind(
                null,
                billProductsConfig.searchedProduct
              )}
            >
              <RiCloseCircleFill />
            </button>
          )}
        </div>
      </div>
      {/** PRODUCT *************************** */}
    </Fragment>
  );
};

export default AddNewProductToPurchaseBill;
