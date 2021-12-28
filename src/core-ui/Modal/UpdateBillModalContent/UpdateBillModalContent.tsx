import React, { useEffect, useState } from "react";
import Switch from "../../Switch/Switch";
import { FaEdit } from "react-icons/fa";
import classes from "./UpdateBillModalContent.module.scss";
import UpdateNewProductToBill from "./UpdateNewProductToBill/UpdateNewProductToBill";
import {
  BillsDoc,
  SendRequestData,
  UpdateRequestData,
} from "../../../interfaces";
import { BillType } from "../../../types/bills";
import useHttp from "../../../hooks/use-http";
import { sendData, updateData } from "../../../services/api";
import {
  BillRequestAction,
  COLLECTIONS,
  CRUDRequest,
} from "../../../constants";
import useProduct from "../../../hooks/use-product";
import { useAppDispatch } from "../../../hooks/use-app-dispatch";
import { addBillsData } from "../../../store/bills/bill-slice";
import useBillProductsController from "../../../hooks/use-bill-products-controller";
import {
  stockActions,
  transformDataFromNormalBillToStock,
} from "../../../store/stock/stock-slice";
import { useAppSelector } from "../../../hooks/use-app-selector";
import {
  changeBillProductsTotalAmount,
  deleteBillProductsValue,
  formatFullDate,
  resetBillProductsValue,
  trimBillDataBeforeAction,
} from "../../../helpers/functions";
import moment from "moment";
import usePurchaseBillController from "../../../hooks/use-purchase-bill-controller";
import useUpdateBillController from "../../../hooks/use-update-bill-controller";
import { AppDispatch } from "../../../store";

const UpdateBillModalContent: React.FC<{
  data: BillsDoc;
  hideUpdateModal: Function;
  updatedBillData: any;
  dispatchBillActions: Function;
}> = (props) => {
  const billDataType = props.data.type === BillType.NORMAL_BILL;

  const [billType, setBillType] = useState<boolean>(billDataType);

  const dispatch = useAppDispatch();

  const { data: stockData } = useAppSelector((state) => state.stock);

  const { billProductsData, dispatchBillActions } = useUpdateBillController();

  const { productFormArray: billProducts } = useProduct();

  const { sendHttpRequest: updateBill } = useHttp(updateData);

  function changeBillType<T>(event: React.FormEvent<T>) {
    setBillType((prevState) => !prevState);
  }

  const submitBillFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const billData: BillsDoc = {
      id: props.data.id,
      total: props.updatedBillData.billTotal,
      createdAt: props.data.createdAt,
      products: [...props.updatedBillData.billSelectedProducts],
      type: billType ? BillType.NORMAL_BILL : BillType.RETURNED_BILL,
      updatedAt: new Date().toString(),
    };

    // UPDATE STOCK IN DATABASE
    //prettier-ignore
    dispatch(transformDataFromNormalBillToStock({ billData, action: BillRequestAction.UPDATE_BILL,}));

    //prettier-ignore
    // const newBillProducts = deleteBillProductsValue(billData.products, "initialProductAmount");
    //prettier-ignore
    // const newerBillProducts = deleteBillProductsValue(newBillProducts, "oldProductAmount");
    // billData.products = newerBillProducts;

    // UPDATE BILL IN DATABASE
    updateBill({
      collectionName: COLLECTIONS.BILLS,
      docId: billData.id,
      newData: billData,
    } as UpdateRequestData)
      .then((_) => {
        dispatch(addBillsData());
      })
      .then((_) => {
        props.hideUpdateModal();
      });
  };

  return (
    <div className={classes["add-bill-modal"]}>
      <div className={classes["add-bill-modal__header"]}>
        <h2 className={classes["add-bill-modal__header--date"]}>
          تعديل فاتوره شراء بتاريخ - {formatFullDate(props.data.createdAt)}
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
            <h4 className="form-title">نوع الفاتوره</h4>
            <div className={classes["add-bill-form__type"]}>
              {billType ? (
                <label htmlFor="bill-type" className="form-label">
                  فاتوره عاديه:{" "}
                </label>
              ) : (
                <label htmlFor="bill-type" className="form-label">
                  فاتوره مرتجع:{" "}
                </label>
              )}
              <div className={classes["add-bill-form__type--wrapper"]}>
                <input
                  type="checkbox"
                  id="bill-type"
                  name="bill-product-type"
                  onChange={changeBillType}
                  className={classes["add-bill-form__checkbox"]}
                />
                <Switch billType={billType} changeBillType={changeBillType} />
              </div>
            </div>
          </div>
          <div className="form-control mt-md">
            <h4 className="form-title">بيانات المنتج</h4>

            {/** PRODUCTS */}
            <div className={classes["add-bill-form__products"]}>
              {/** PRODUCT *************************** */}
              {billProducts.map((productIndex) => {
                return (
                  <UpdateNewProductToBill
                    key={productIndex}
                    dispatchBillActions={props.dispatchBillActions}
                    billData={props.data}
                    billFallbackData={props.updatedBillData}
                  />
                );
              })}
            </div>
            {/** PRODUCT *************************** */}
          </div>
          {/** PRODUCTS */}
          <div className={classes["add-bill-form__actions"]}>
            <div className={classes["add-bill-form__actions--ctas"]}>
              <button type="submit" className="btn btn--primary btn--add">
                <span className={`fix-icon`}>
                  <FaEdit />
                </span>
                تعديل فاتوره
              </button>
            </div>
            <ul className={classes["add-bill-form__actions--info"]}>
              <li className={classes["add-bill-form__actions--info-item"]}>
                <span className="label">عدد المنتجات</span>
                <span className="value">{props.data.products.length}</span>
              </li>
              <li className={classes["add-bill-form__actions--info-item"]}>
                <span className="label">المجموع</span>
                <span className="value">{props.updatedBillData.billTotal}</span>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBillModalContent;
