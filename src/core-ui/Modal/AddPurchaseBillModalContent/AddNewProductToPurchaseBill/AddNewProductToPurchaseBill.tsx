import React, { Fragment } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./AddNewProductToPurchaseBill.module.scss";
import useBillProducts from "../../../../hooks/use-bill-products";
import { BillType } from "../../../../types/bills";

const AddNewProductToPurchaseBill: React.FC<{
  productIndex: number;
  removeNewBillProduct: Function;
  firstProductInBill: number;
  dispatchBillActions: Function;
  billType: BillType;
}> = (props) => {
  const { dispatchBillActions, removeNewBillProduct, billType } = props;

  const {
    billProductsConfig,
    getSearchValue,
    onChangeProductAmountHandler,
    onChangePiecePriceHandler,
    onChangeNumberOfUnitsHandler,
    onChangePriceOfUnit,
    removeProductFromBill,
  } = useBillProducts(dispatchBillActions, removeNewBillProduct, billType);

  console.log("billProductsConfig", billProductsConfig.searchedProduct);

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
              onChange={onChangePriceOfUnit.bind(
                null,
                billProductsConfig.searchedProduct
              )}
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
