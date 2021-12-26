import React, { Fragment, useEffect } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { CRUDRequest } from "../../../../constants";
import useBillProducts from "../../../../hooks/use-bill-products";
import useUpdateBill from "../../../../hooks/use-update-bill";
import { BillsDoc } from "../../../../interfaces";
import { BillType } from "../../../../types/bills";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import classes from "./UpdateNewProductToBill.module.scss";

const UpdateNewProductToBill: React.FC<{
  dispatchBillActions: Function;
  billData: BillsDoc;
  billType: BillType;
  CRUDRequest?: CRUDRequest;
  removeNewBillProduct: Function;
  billFallbackData: any;
}> = (props) => {
  const { dispatchBillActions, removeNewBillProduct, billType } = props;

  const { onChangeProductAmountHandler } = useUpdateBill(
    dispatchBillActions,
    removeNewBillProduct,
    billType,
    props.billData,
    props.CRUDRequest
  );

  return (
    <Fragment>
      {/* {props.billFallbackData.billSelectedProducts.map((product: any) => { */}
      {props.billFallbackData.billSelectedProducts.map((product: any) => {
        //prettier-ignore
        const oldProduct = props.billData.products.find((oldProduct: any) => oldProduct.id === product.id)!;
        //prettier-ignore
        const updatedProductAmount = product.updatedProductAmount ? product.updatedProductAmount : 0;

        // const isLessAmount =
        //   oldProduct.oldProductAmount! > product.updatedProductAmount;

        // const billTotalClasses = isLessAmount
        //   ? `${classes["update-bill-product__info--minus-total"]}`
        //   : `${classes["update-bill-product__info--plus-total"]}`;

        return (
          <Fragment key={product.id}>
            {/** PRODUCT *************************** */}
            <div className={classes["update-bill-product"]}>
              {/** PRODUCT NAME */}
              <div
                className={`${classes["update-bill-product__info"]} ${classes["update-bill-product__info--product-name"]}`}
              >
                <label
                  htmlFor={`bill-product-name-${product.id}`}
                  className="form-label"
                >
                  اسم المنتج
                </label>
                <div
                  className={classes["update-bill-product__info--static-value"]}
                >
                  {product.productName}
                </div>
                {/* <SmartSearch getSearchValue={getSearchValue} /> */}
              </div>
              {/** PRODUCT PRICE */}
              <div className={classes["update-bill-product__info"]}>
                <label className="form-label">سعر المنتج</label>
                <span
                  className={classes["update-bill-product__info--static-value"]}
                >
                  {product.priceOfUnit}
                </span>
              </div>
              {/** PRODUCT OLD AMOUNT */}
              <div className={classes["update-bill-product__info"]}>
                <label className="form-label">الكميه القديمه</label>
                <span
                  className={classes["update-bill-product__info--static-value"]}
                >
                  {oldProduct.totalProductAmount}
                </span>
              </div>
              {/** PRODUCT NEW AMOUNT */}
              <div className={classes["update-bill-product__info"]}>
                <label
                  htmlFor={`bill-product-amount-${product.id}`}
                  className="form-label"
                >
                  الكميه الجديده
                </label>
                <input
                  type="number"
                  id={`bill-product-amount-${product.id}`}
                  className={classes["update-bill-product__info--input"]}
                  min={0}
                  max={product.totalNumberOfUnits}
                  step="0.01"
                  name="bill-product-amount"
                  value={updatedProductAmount}
                  onChange={onChangeProductAmountHandler.bind(null, oldProduct)}
                />
              </div>
              {/** PRODUCT TOTAL PRICE */}
              {/* <div className={classes["update-bill-product__info"]}>
                <label htmlFor="bill-product-total" className="form-label">
                  المجموع {isLessAmount ? "الناقص" : "الأضافي"}
                </label>
                {product.id && (
                  <span
                    className={`${classes["update-bill-product__info--static-value"]} ${billTotalClasses}`}
                  >
                    {product.priceOfUnit * product.initialProductAmount}
                    {isLessAmount ? "-" : "+"}
                  </span>
                )}
              </div> */}
            </div>
            {/** PRODUCT *************************** */}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default UpdateNewProductToBill;
