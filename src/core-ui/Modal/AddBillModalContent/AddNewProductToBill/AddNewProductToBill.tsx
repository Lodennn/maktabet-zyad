import React, { Fragment } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./AddNewProductToBill.module.scss";

const AddNewProductToBill: React.FC<{
  productIndex: number;
  removeProductFromBill: (
    productIndex: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  firstProductInBill: number;
}> = (props) => {
  return (
    <Fragment>
      {/** PRODUCT *************************** */}
      <div className={classes["add-bill-product"]}>
        {/** PRODUCT NAME */}
        <div className={classes["add-bill-product__info"]}>
          <label
            htmlFor={`bill-product-name-${props.productIndex}`}
            className="form-label"
          >
            اسم المنتج
          </label>
          {/* <select
            id={`bill-product-name-${props.productIndex}`}
            className={classes["add-bill-product__info--input"]}
          >
            <option>قلم روتو</option>
          </select> */}
          <SmartSearch />
        </div>
        {/** PRODUCT PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">سعر المنتج</label>
          <span className={classes["add-bill-product__info--input"]}>9</span>
        </div>

        {/** PRODUCT AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label
            htmlFor={`bill-product-amount-${props.productIndex}`}
            className="form-label"
          >
            الكميه
          </label>
          <input
            type="number"
            id={`bill-product-amount-${props.productIndex}`}
            className={classes["add-bill-product__info--input"]}
            value="1"
            onChange={() => {}}
          />
        </div>
        {/** PRODUCT TOTAL PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label htmlFor="bill-product-total" className="form-label">
            المجموع
          </label>
          <span className={classes["add-bill-product__info--input"]}>105</span>
        </div>
        {/** PRODUCT REMOVE */}
        <div className={classes["add-bill-product__info"]}>
          {props.productIndex !== props.firstProductInBill && (
            <button
              type="button"
              className={classes["add-bill-product__info--remove"]}
              onClick={props.removeProductFromBill.bind(
                null,
                props.productIndex
              )}
            >
              <RiCloseCircleFill />
            </button>
          )}
        </div>
        {/* <div
          className={`${classes["add-bill-product--separator"]} separator separator--soft`}
        ></div> */}
      </div>
      {/** PRODUCT *************************** */}
    </Fragment>
  );
};

export default AddNewProductToBill;
