import React, { Fragment, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import { StockDoc } from "../../../../interfaces";
import { billsActions } from "../../../../store/bills/bill-slice";
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
        {/** PRODUCT CATEGORY */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">نوع المنتج</label>
          <select>
            <option>كراس</option>
            <option>قلم</option>
            <option>برايه</option>
          </select>
        </div>
        {/** PRODUCT PIECES AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">عدد القطع</label>
          <input type="number" />
        </div>
        {/** PRODUCT PIECE PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن القطعه(جمله)</label>
          <input type="text" />
        </div>
        {/** PRODUCT UNITS AMOUNT */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">عدد الوحده في القطعه</label>
          <input type="text" />
        </div>
        {/** PRODUCT UNIT PRICE */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن الوحده</label>
          <input type="text" />
        </div>
        {/** PRODUCT UNIT PRICE(SELL) */}
        <div className={classes["add-bill-product__info"]}>
          <label className="form-label">ثمن الشراء</label>
          <input type="text" />
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
