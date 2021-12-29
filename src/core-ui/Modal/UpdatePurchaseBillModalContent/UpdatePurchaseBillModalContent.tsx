import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { PurchasesDoc, SendRequestData } from "../../../interfaces";
import { BillRequestAction, COLLECTIONS } from "../../../constants";
import { BillType } from "../../../types/bills";
import useHttp from "../../../hooks/use-http";
import { sendData } from "../../../services/api";
import useProduct from "../../../hooks/use-product";
import { useAppDispatch } from "../../../hooks/use-app-dispatch";
import { addPurchasesDataToStore } from "../../../store/purchases/purchases-slice";
import { transformDataFromNormalBillToStock } from "../../../store/stock/stock-slice";
import UpdateNewProductToPurchaseBill from "./UpdateNewProductToPurchaseBill/UpdateNewProductToPurchaseBill";
import classes from "./UpdatePurchaseBillModalContent.module.scss";
import { PurchaseBillConfigInitialState } from "../../../hooks/use-update-bill";

const UpdatePurchaseBillModalContent: React.FC<{
  data: any;
  hideUpdatePurchaseModal: Function;
  updatedPurchaseBillData: any;
  dispatchPurchaseBillActions: Function;
}> = (props) => {
  const dispatch = useAppDispatch();

  const purchaseBillMerchantNameRef = useRef<HTMLInputElement>(null);

  const { productFormArray: billProducts } = useProduct();

  const { sendHttpRequest: insertBill } = useHttp(sendData);

  //prettier-ignore
  const [billDataConfig, setBillDataConfig] = useState<any>();

  //prettier-ignore
  const getBillConfigData = useCallback((billConfigData: PurchaseBillConfigInitialState) => {
    setBillDataConfig(billConfigData)
  }, [])

  // useEffect(() => {
  //   console.log("billDataConfig: ", billDataConfig);
  // }, [billDataConfig]);

  const submitBillFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // BILL DATA
    const billData: PurchasesDoc = {
      merchantName: props.data.merchantName,
      total: props.updatedPurchaseBillData.billTotal,
      createdAt: new Date().toString(),
      products: [...props.updatedPurchaseBillData.billSelectedProducts],
      type: BillType.PURCHASES_BILL,
    };

    console.log("final billData: ", billData, billDataConfig);

    // UPDATE STOCK IN DATABASE
    //prettier-ignore
    dispatch(transformDataFromNormalBillToStock({ billData, billDataConfig, action: BillRequestAction.UPDATE_BILL}));

    // INSERT BILL TO DATABASE
    // insertBill({
    //   collectionName: COLLECTIONS.PURCHASES,
    //   data: billData,
    // } as SendRequestData)
    //   .then((_) => {
    //     dispatch(addPurchasesDataToStore());
    //   })
    //   .then((_) => {
    //     props.hideUpdatePurchaseModal();
    //   });
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
              <div>{props.data.merchantName}</div>
              {/* <input
                type="text"
                id="bill-type"
                name="bill-merchant-name"
                className={classes["add-bill-form__input"]}
                placeholder="أسم التاجر"
                value={props.data.merchantName}
                onChange={() => {}}
                ref={purchaseBillMerchantNameRef}
              /> */}
            </div>
          </div>
          <div className="form-control mt-md">
            <h4 className="form-title">بيانات الفاتوره</h4>

            {/** PRODUCTS */}
            <div className={classes["add-bill-form__products"]}>
              {/** PRODUCT *************************** */}
              {billProducts.map((productIndex) => {
                return (
                  <UpdateNewProductToPurchaseBill
                    key={productIndex}
                    dispatchPurchaseBillActions={
                      props.dispatchPurchaseBillActions
                    }
                    billData={props.data}
                    billFallbackData={props.updatedPurchaseBillData}
                    getBillConfigData={getBillConfigData}
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
                تعديل فاتورة شراء
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
                  {props.updatedPurchaseBillData.billTotal}
                </span>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePurchaseBillModalContent;
