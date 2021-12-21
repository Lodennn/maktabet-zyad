import React, { useEffect, useReducer } from "react";
import { FaPlus } from "react-icons/fa";
import { useAppSelector } from "../../../hooks/use-app-selector";
import { BillsDoc, PurchasesDoc, SendRequestData } from "../../../interfaces";
import { BillType } from "../../../types/bills";
import useHttp from "../../../hooks/use-http";
import { sendData } from "../../../services/api";
import { COLLECTIONS } from "../../../constants";
import useProduct from "../../../hooks/use-product";
import classes from "./AddPurchaseBillModalContent.module.scss";
import AddNewProductToPurchaseBill from "./AddNewProductToPurchaseBill/AddNewProductToPurchaseBill";
import { StockDoc } from "../../../interfaces";

export interface PurchaseBillInitialState {
  billSelectedProducts: StockDoc[];
  billTotal: number;
}

type PurchaseBillActionType = {
  type: string;
  payload: { data: any };
};

const initialState: PurchaseBillInitialState = {
  billSelectedProducts: [],
  billTotal: 0,
};

const reducerFn = (
  state: PurchaseBillInitialState = initialState,
  action: PurchaseBillActionType
) => {
  if (action.type === "ADD_PRODUCT") {
    console.log("action.payload.data: ", action.payload.data);
    const searchedProductIndex = [...state.billSelectedProducts].findIndex(
      (searchedProduct) => searchedProduct.id === action.payload.data.id
    );

    let updatedBillProducts: StockDoc[] = [];

    if (searchedProductIndex >= 0) {
      updatedBillProducts = [...state.billSelectedProducts];

      //prettier-ignore
      updatedBillProducts[searchedProductIndex] = action.payload.data;
    } else {
      updatedBillProducts = state.billSelectedProducts.concat(
        action.payload.data
      );
    }

    const updatedBillTotal = updatedBillProducts.reduce((acc, cur) => {
      return acc + cur.priceOfPiece * cur.totalProductAmount!;
    }, 0);

    return {
      billSelectedProducts: updatedBillProducts,
      billTotal: updatedBillTotal,
    };
    // const updatedState = { ...state, searchedProduct: action.payload.data, billProducts };
  }

  return state;
};

const AddPurchaseBillModalContent: React.FC<{ hideAddBillModal: Function }> = (
  props
) => {
  const [billProductsData, dispatchBillActions] = useReducer(
    reducerFn,
    initialState
  );

  const {
    productFormArray: billProducts,
    addProductFormData: addNewBillProduct,
    removeProductFormData: removeNewBillProduct,
  } = useProduct();

  const { total, billSelectedProducts } = useAppSelector(
    (state) => state.purchases
  );

  console.log("billProductsData: ", billProductsData);
  // console.log("billProductsData[REDUX]: ", billSelectedProducts);

  const { sendHttpRequest: insertBill } = useHttp(sendData);

  const submitBillFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // BILL DATA
    const billData: PurchasesDoc = {
      total,
      createdAt: new Date().toString(),
      products: [...billSelectedProducts],
      type: BillType.PURCHASES_BILL,
    };

    // // INSERT BILL TO DATABASE
    // insertBill({
    //   collectionName: COLLECTIONS.PURCHASES,
    //   data: billData,
    // } as SendRequestData).then((_) => {
    //   props.hideAddBillModal();
    // });
    // console.log("submitted");
  };

  return (
    <div className={classes["add-bill-modal"]}>
      <div className={classes["add-bill-modal__header"]}>
        <h2 className={classes["add-bill-modal__header--date"]}>
          أضافة فاتورة شراء
        </h2>
        <div className="separator separator--soft"></div>
      </div>
      <div className={classes["add-bill-modal__body"]}>
        {/** ADD BILL FORM */}
        <form
          className={classes["add-bill-form"]}
          onSubmit={submitBillFormHandler}
        >
          <div className="form-control">
            <h4 className="form-title">أسم التاجر</h4>
            <div>
              <input
                type="text"
                id="bill-type"
                name="bill-merchant-name"
                className={classes["add-bill-form__input"]}
                placeholder="أسم التاجر"
              />
            </div>
          </div>
          <div className="form-control mt-md">
            <h4 className="form-title">بيانات الفاتوره</h4>

            {/** PRODUCTS */}
            <div className={classes["add-bill-form__products"]}>
              {/** PRODUCT *************************** */}
              {billProducts.map((productIndex, _, billProductsArray) => {
                return (
                  <AddNewProductToPurchaseBill
                    key={productIndex}
                    productIndex={productIndex}
                    removeNewBillProduct={removeNewBillProduct}
                    firstProductInBill={billProductsArray[0]}
                    billProductsData={billProductsData}
                    dispatchBillActions={dispatchBillActions}
                  />
                );
              })}
            </div>
            {/** PRODUCT *************************** */}
          </div>
          {/** PRODUCTS */}
          <div className={classes["add-bill-form__actions"]}>
            <div className={classes["add-bill-form__actions--ctas"]}>
              <button
                type="button"
                className="btn btn--default btn--add"
                onClick={addNewBillProduct}
              >
                أضف منتج
              </button>
              <button type="submit" className="btn btn--primary btn--add">
                <span className={`fix-icon`}>
                  <FaPlus />
                </span>
                أضف فاتورة شراء
              </button>
            </div>
            <ul className={classes["add-bill-form__actions--info"]}>
              <li className={classes["add-bill-form__actions--info-item"]}>
                <span className={classes["add-bill-form__actions--info-label"]}>
                  عدد المنتجات
                </span>
                <span className={classes["add-bill-form__actions--info-value"]}>
                  {billProducts.length}
                </span>
              </li>
              <li className={classes["add-bill-form__actions--info-item"]}>
                <span className={classes["add-bill-form__actions--info-label"]}>
                  المجموع
                </span>
                <span className={classes["add-bill-form__actions--info-value"]}>
                  {billProductsData.billTotal}
                </span>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseBillModalContent;
