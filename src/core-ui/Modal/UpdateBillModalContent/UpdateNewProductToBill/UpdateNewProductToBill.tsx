import React, { Fragment, useEffect } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import useBillProducts from "../../../../hooks/use-bill-products";
import useUpdateBill from "../../../../hooks/use-update-bill";
import { BillsDoc } from "../../../../interfaces";
import { BillType } from "../../../../types/bills";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./UpdateNewProductToBill.module.scss";

const UpdateNewProductToBill: React.FC<{
  dispatchBillActions: Function;
  billData: any;
  billType: BillType;
  removeNewBillProduct: Function;
  billFallbackData: any;
}> = (props) => {
  const { dispatchBillActions, removeNewBillProduct, billType } = props;

  // const {
  //   billProductsConfig,
  //   getSearchValue,
  //   onChangeProductAmountHandler,
  //   removeProductFromBill,
  // } = useBillProducts(dispatchBillActions, removeNewBillProduct, billType);

  const {
    billProductsConfig,
    getSearchValue,
    onChangeProductAmountHandler,
    removeProductFromBill,
  } = useUpdateBill(dispatchBillActions, removeNewBillProduct, billType, {
    billSelectedProducts: props.billData.products,
    billTotal: props.billData.total,
  });

  return (
    <Fragment>
      {props.billFallbackData.billSelectedProducts.map((product: any) => {
        return (
          <Fragment key={product.id}>
            {/** PRODUCT *************************** */}
            <div className={classes["add-bill-product"]}>
              {/** PRODUCT NAME */}
              <div
                className={`${classes["add-bill-product__info"]} ${classes["add-bill-product__info--product-name"]}`}
              >
                <label
                  htmlFor={`bill-product-name-${product.id}`}
                  className="form-label"
                >
                  اسم المنتج
                </label>
                <div>{product.productName}</div>
                {/* <SmartSearch getSearchValue={getSearchValue} /> */}
              </div>
              {/** PRODUCT PRICE */}
              <div className={classes["add-bill-product__info"]}>
                <label className="form-label">سعر المنتج</label>
                {product.id && (
                  <span className={classes["add-bill-product__info--input"]}>
                    {product.priceOfUnit}
                  </span>
                )}
              </div>
              {/** PRODUCT AMOUNT */}
              <div className={classes["add-bill-product__info"]}>
                <label
                  htmlFor={`bill-product-amount-${product.id}`}
                  className="form-label"
                >
                  الكميه
                  {/* <h5 className="label">
                    القيمه القديمه{" "}
                    <span className="value">{product.totalProductAmount}</span>
                  </h5> */}
                </label>
                {product.id && (
                  <input
                    type="number"
                    id={`bill-product-amount-${product.id}`}
                    className={classes["add-bill-product__info--input"]}
                    min={1}
                    max={product.totalNumberOfUnits}
                    name="bill-product-amount"
                    placeholder={product.totalProductAmount}
                    value={product.totalProductAmount}
                    onChange={onChangeProductAmountHandler.bind(null, product)}
                  />
                )}
              </div>
              {/** PRODUCT TOTAL PRICE */}
              <div className={classes["add-bill-product__info"]}>
                <label htmlFor="bill-product-total" className="form-label">
                  المجموع
                </label>
                {product.id && (
                  <span className={classes["add-bill-product__info--input"]}>
                    {product.priceOfUnit * product.totalProductAmount}
                  </span>
                )}
              </div>
            </div>
            {/** PRODUCT *************************** */}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default UpdateNewProductToBill;
