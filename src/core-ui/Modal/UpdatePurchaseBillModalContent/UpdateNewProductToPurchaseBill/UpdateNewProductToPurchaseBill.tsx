import React, { Fragment, useEffect } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import SmartSearch from "../../../SmartSearch/SmartSearch";
import usePurchaseBill from "../../../../hooks/use-purchase-bill";
import { useAppSelector } from "../../../../hooks/use-app-selector";
import classes from "./UpdateNewProductToPurchaseBill.module.scss";
import useUpdatePurchaseBill from "../../../../hooks/use-update-purchase-bill";
import { PurchasesDoc } from "../../../../interfaces";
import { PurchaseBillConfigInitialState } from "../../../../hooks/use-update-bill";

const UpdateNewProductToPurchaseBill: React.FC<{
  dispatchPurchaseBillActions: Function;
  billData: PurchasesDoc;
  billFallbackData: any;
  getBillConfigData: (billConfigData: any) => void;
}> = (props) => {
  const { dispatchPurchaseBillActions, getBillConfigData } = props;
  // const { dispatchPurchaseBillActions } = props;

  const {
    billProductsConfig,
    onChangeProductCategoryHandler,
    onChangeProductAmountHandler,
    onChangePiecePriceHandler,
    onChangeNumberOfUnitsHandler,
    onChangePriceOfUnit,
  } = useUpdatePurchaseBill(dispatchPurchaseBillActions);

  useEffect(() => {
    // console.log("useEffect");
    getBillConfigData(billProductsConfig);
  }, [getBillConfigData, billProductsConfig]);

  return (
    <Fragment>
      {props.billFallbackData.billSelectedProducts.map((product: any) => {
        //prettier-ignore
        const oldProduct = props.billData.products.find((oldProduct: any) => oldProduct.id === product.id)!;

        return (
          <div
            className={classes["add-bill-product"]}
            key={product.productName}
          >
            {/** PRODUCT NAME */}
            <div
              className={`${classes["add-bill-product__info"]} ${classes["add-bill-product__info--product-name"]}`}
            >
              <label
                htmlFor={`bill-product-name-${product.productName}`}
                className="form-label"
              >
                اسم المنتج
              </label>
              <div
                className={classes["update-bill-product__info--static-value"]}
              >
                {product.productName}
              </div>
            </div>
            {/** PRODUCT CATEGORY */}
            <div className={classes["add-bill-product__info"]}>
              <label className="form-label">نوع المنتج</label>
              <select
                defaultValue={product.category}
                onChange={onChangeProductCategoryHandler.bind(null, oldProduct)}
              >
                <option></option>
                <option>كراس</option>
                <option>قلم</option>
                <option>برايه</option>
              </select>
            </div>
            {/** PRODUCT PIECES AMOUNT */}
            <div className={classes["add-bill-product__info"]}>
              <label className="form-label">عدد القطع</label>
              <input
                type="number"
                placeholder={product.totalProductAmount + ""}
                onChange={onChangeProductAmountHandler.bind(null, oldProduct)}
              />
            </div>
            {/** PRODUCT PIECE PRICE */}
            <div className={classes["add-bill-product__info"]}>
              <label className="form-label">ثمن القطعه(جمله)</label>
              <input
                type="number"
                min={1}
                placeholder={product.priceOfPiece + ""}
                onChange={onChangePiecePriceHandler.bind(null, oldProduct)}
              />
            </div>
            {/** PRODUCT UNITS AMOUNT */}
            <div className={classes["add-bill-product__info"]}>
              <label className="form-label">عدد الوحده في القطعه</label>
              <input
                type="number"
                placeholder={product.numberOfUnits + ""}
                onChange={onChangeNumberOfUnitsHandler.bind(null, oldProduct)}
                min={1}
              />
            </div>
            {/** PRODUCT UNIT PRICE */}
            <div className={classes["add-bill-product__info"]}>
              <label className="form-label">ثمن الوحده</label>
              <input
                type="number"
                min={1}
                placeholder={product.priceOfUnit + ""}
                onChange={onChangePriceOfUnit.bind(null, oldProduct)}
              />
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default UpdateNewProductToPurchaseBill;