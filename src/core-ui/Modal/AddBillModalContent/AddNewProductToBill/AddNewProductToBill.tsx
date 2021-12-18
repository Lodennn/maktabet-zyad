import React, { Fragment, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import { StockDoc } from "../../../../interfaces";
import { billsActions } from "../../../../store/bills/bill-slice";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./AddNewProductToBill.module.scss";

const AddNewProductToBill: React.FC<{
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
      billsActions.addProductToBill({
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
      billsActions.addProductToBill({
        selectedProduct: searchedProductWithAmount,
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
      billsActions.removeProductFromBill({
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
        {/** PRODUCT PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">سعر المنتج</label>
          {searchedProduct.id && (
            <span className={classes["add-bill-product__info--input"]}>
              {searchedProduct.priceOfUnit}
            </span>
          )}
        </div>

        {/** PRODUCT AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label
            htmlFor={`bill-product-amount-${props.productIndex}`}
            className="form-label"
          >
            الكميه
          </label>
          {searchedProduct.id && (
            <input
              type="number"
              id={`bill-product-amount-${props.productIndex}`}
              className={classes["add-bill-product__info--input"]}
              min={1}
              value={searchedProductAmount}
              onChange={onChangeProductAmountHandler.bind(
                null,
                searchedProduct
              )}
            />
          )}
        </div>
        {/** PRODUCT TOTAL PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label htmlFor="bill-product-total" className="form-label">
            المجموع
          </label>
          {searchedProduct.id && (
            <span className={classes["add-bill-product__info--input"]}>
              {searchedProduct.priceOfUnit * searchedProductAmount}
            </span>
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

export default AddNewProductToBill;
