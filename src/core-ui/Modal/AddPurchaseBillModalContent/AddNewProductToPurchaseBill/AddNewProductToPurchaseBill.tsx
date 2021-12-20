import React, { Fragment, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import { StockDoc } from "../../../../interfaces";
import { purchasesActions } from "../../../../store/purchases/purchases-slice";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./AddNewProductToPurchaseBill.module.scss";

const AddNewProductToPurchaseBill: React.FC<{
  productIndex: number;
  removeNewBillProduct: (productIndex: number) => void;
  firstProductInBill: number;
}> = (props) => {
  //prettier-ignore
  const [searchedProduct, setSearchedProduct] = useState<StockDoc>({} as StockDoc);

  const [searchedProductAmount, setSearchedProductAmount] = useState<number>(1);

  const dispatch = useAppDispatch();

  const getSearchValue = (searchedProduct: StockDoc) => {
    setSearchedProduct(searchedProduct);

    const searchedProductWithAmount = {
      ...searchedProduct,
      totalProductAmount: searchedProductAmount,
    };
    dispatch(
      purchasesActions.addProductToBill({
        selectedProduct: searchedProductWithAmount,
      })
    );
  };

  const onChangeProductAmountHandler = (
    searchedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    setSearchedProductAmount(targetValue);

    const searchedProductWithAmount = {
      ...searchedProduct,
      totalProductAmount: +target.value,
    };

    dispatch(
      purchasesActions.addProductToBill({
        selectedProduct: searchedProductWithAmount,
      })
    );
  };

  const onChangePiecePriceHandler = (
    searchedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    const searchedProductData = {
      ...searchedProduct,
      priceOfPiece: targetValue,
      totalProductAmount: searchedProductAmount,
    };

    dispatch(
      purchasesActions.updateBillProducts({
        selectedProduct: searchedProductData,
      })
    );
  };

  const removeProductFromBill = (searchedProduct: StockDoc) => {
    props.removeNewBillProduct(props.productIndex);

    const searchedProductWithAmount = {
      ...searchedProduct,
      totalProductAmount: searchedProductAmount,
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
          {searchedProduct.id && (
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
          {searchedProduct.id && (
            <input
              type="number"
              value={searchedProductAmount}
              onChange={onChangeProductAmountHandler.bind(
                null,
                searchedProduct
              )}
            />
          )}
        </div>
        {/** PRODUCT PIECE PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن القطعه(جمله)</label>
          {searchedProduct.id && (
            <input
              type="number"
              placeholder={searchedProduct.priceOfPiece + ""}
              id={`bill-product-amount-${props.productIndex}`}
              min={1}
              onChange={onChangePiecePriceHandler.bind(null, searchedProduct)}
            />
          )}
        </div>
        {/** PRODUCT UNITS AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">عدد الوحده في القطعه</label>
          {searchedProduct.id && (
            <input
              type="number"
              id={`bill-product-amount-${props.productIndex}`}
              min={1}
            />
          )}
        </div>
        {/** PRODUCT UNIT PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن الوحده</label>
          {searchedProduct.id && (
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
              onClick={removeProductFromBill.bind(null, searchedProduct)}
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
