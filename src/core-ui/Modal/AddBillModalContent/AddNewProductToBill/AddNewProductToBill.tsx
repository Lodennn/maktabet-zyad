import { Fragment } from "react";
import classes from "./AddNewProductToBill.module.scss";

const AddNewProductToBill: React.FC = () => {
  return (
    <Fragment>
      {/** PRODUCT *************************** */}
      <div className={classes["add-bill-product"]}>
        {/** PRODUCT NAME */}
        <div className={classes["add-bill-product__info"]}>
          <label htmlFor="bill-product-name" className="form-label">
            اسم المنتج
          </label>
          <select
            id="bill-product-name"
            className={classes["add-bill-product__info--input"]}
          >
            <option>قلم روتو</option>
          </select>
        </div>
        {/** PRODUCT PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label htmlFor="bill-product-price" className="form-label">
            سعر المنتج
          </label>
          <span className={classes["add-bill-product__info--input"]}>9</span>
        </div>

        {/** PRODUCT AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label htmlFor="bill-product-amount" className="form-label">
            الكميه
          </label>
          <input
            type="number"
            id="bill-product-amount"
            className={classes["add-bill-product__info--input"]}
            value="1"
          />
        </div>
        {/** PRODUCT TOTAL PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label htmlFor="bill-product-total" className="form-label">
            المجموع
          </label>
          <span className={classes["add-bill-product__info--input"]}>105</span>
        </div>
        <div
          className={`${classes["add-bill-product--separator"]} separator separator--soft`}
        ></div>
      </div>
      {/** PRODUCT *************************** */}
    </Fragment>
  );
};

export default AddNewProductToBill;
