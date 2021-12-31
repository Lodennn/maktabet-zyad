import React, { useEffect, useState } from "react";
import Switch from "../../Switch/Switch";
import { FaPlus } from "react-icons/fa";
import { BillsDoc, OutlaysDoc, SendRequestData } from "../../../interfaces";
import { BillType } from "../../../types/bills";
import useHttp from "../../../hooks/use-http";
import { sendData } from "../../../services/api";
import {
  BillRequestAction,
  COLLECTIONS,
  CRUDRequest,
} from "../../../constants";
import useProduct from "../../../hooks/use-product";
import { useAppDispatch } from "../../../hooks/use-app-dispatch";
import { addBillsData, insertBill } from "../../../store/bills/bill-slice";
import useBillProductsController from "../../../hooks/use-bill-products-controller";
import {
  addStockDataToStore,
  transformDataFromNormalBillToStock,
} from "../../../store/stock/stock-slice";
import { useAppSelector } from "../../../hooks/use-app-selector";
import classes from "../AddBillModalContent/AddBillModalContent.module.scss";
import outlayClasses from "./AddNewOutlay.module.scss";
import { insertOutlay } from "../../../store/outlays/outlays-slice";

const AddOutlayModalContent: React.FC<{ hideAddOutlayModal: Function }> = (
  props
) => {
  const [billType, setBillType] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const { data: stockData } = useAppSelector((state) => state.stock);

  const { billProductsData, dispatchBillActions } = useBillProductsController();

  const {
    productFormArray: billProducts,
    addProductFormData: addNewBillProduct,
    removeProductFormData: removeNewBillProduct,
  } = useProduct();

  const [outlayTitle, setOutlayTitle] = useState<string>("");
  const [outlayAmount, setOutlayAmount] = useState<number>(0);

  const onChangeOutlayTitle = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setOutlayTitle(target.value);
  };
  const onChangeOutlayAmount = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setOutlayAmount(+target.value);
  };

  const submitBillFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const outlayData: OutlaysDoc = {
      title: outlayTitle,
      amount: outlayAmount,
      createdAt: new Date().toString(),
    };

    // INSERT OUTLAY TO DATABASE
    dispatch(insertOutlay(outlayData)).then((_) => {
      props.hideAddOutlayModal();
    });
  };

  return (
    <div className={classes["add-bill-modal"]}>
      <div className={classes["add-bill-modal__header"]}>
        <h2 className={classes["add-bill-modal__header--date"]}>
          أضافة المصاريف الخارجيه
        </h2>
        <div className="separator separator--soft"></div>
      </div>
      <div className={classes["add-bill-modal__body"]}>
        {/** ADD BILL FORM */}
        <form
          className={classes["add-bill-form"]}
          onSubmit={submitBillFormHandler}
        >
          <div className="form-control mt-md">
            <h4 className="form-title">المصاريف</h4>

            {/** PRODUCTS */}
            <div className={outlayClasses["add-bill-form__products"]}>
              {/** PRODUCT *************************** */}
              <div className={outlayClasses["add-bill-product"]}>
                {/** PRODUCT NAME */}
                <div className={`${outlayClasses["add-bill-product__info"]}`}>
                  <label className="form-label">العنوان</label>
                  <input
                    type="text"
                    className={outlayClasses["add-bill-product__info--input"]}
                    value={outlayTitle}
                    onChange={onChangeOutlayTitle}
                  />
                </div>

                {/** PRODUCT AMOUNT */}
                <div className={outlayClasses["add-bill-product__info"]}>
                  <label className="form-label">القيمه</label>
                  <input
                    type="number"
                    className={outlayClasses["add-bill-product__info--input"]}
                    min={1}
                    value={outlayAmount}
                    onChange={onChangeOutlayAmount}
                  />
                </div>
              </div>
            </div>
            {/** PRODUCT *************************** */}
          </div>
          {/** PRODUCTS */}
          <div className={classes["add-bill-form__actions"]}>
            <div className={classes["add-bill-form__actions--ctas"]}>
              <button type="submit" className="btn btn--primary btn--add">
                <span className={`fix-icon`}>
                  <FaPlus />
                </span>
                أضف
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutlayModalContent;
