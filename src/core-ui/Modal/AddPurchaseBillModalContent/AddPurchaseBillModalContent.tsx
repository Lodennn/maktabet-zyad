import React, { useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { PurchasesDoc, SendRequestData } from "../../../interfaces";
import { COLLECTIONS } from "../../../constants";
import { BillType } from "../../../types/bills";
import useHttp from "../../../hooks/use-http";
import { sendData } from "../../../services/api";
import useProduct from "../../../hooks/use-product";
import AddNewProductToPurchaseBill from "./AddNewProductToPurchaseBill/AddNewProductToPurchaseBill";
import useBillProductsController from "../../../hooks/use-bill-products-controller";
import classes from "./AddPurchaseBillModalContent.module.scss";
import { useAppDispatch } from "../../../hooks/use-app-dispatch";
import { addPurchasesDataToStore } from "../../../store/purchases/purchases-slice";
const AddPurchaseBillModalContent: React.FC<{ hideAddBillModal: Function }> = (
  props
) => {
  const dispatch = useAppDispatch();

  const purchaseBillMerchantNameRef = useRef<HTMLInputElement>(null);

  const { billProductsData, dispatchBillActions, billType } =
    useBillProductsController(BillType.PURCHASES_BILL);

  const {
    productFormArray: billProducts,
    addProductFormData: addNewBillProduct,
    removeProductFormData: removeNewBillProduct,
  } = useProduct();

  useEffect(() => {
    console.log("billProductsData: ", billProductsData);
  }, [billProductsData]);

  const { sendHttpRequest: insertBill } = useHttp(sendData);

  const submitBillFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // BILL DATA
    const billData: PurchasesDoc = {
      merchantName: purchaseBillMerchantNameRef.current!.value,
      total: billProductsData.billTotal,
      createdAt: new Date().toString(),
      products: [...billProductsData.billSelectedProducts],
      type: BillType.PURCHASES_BILL,
    };

    // INSERT BILL TO DATABASE
    insertBill({
      collectionName: COLLECTIONS.PURCHASES,
      data: billData,
    } as SendRequestData)
      .then((_) => {
        dispatch(addPurchasesDataToStore());
      })
      .then((_) => {
        props.hideAddBillModal();
      });
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
                ref={purchaseBillMerchantNameRef}
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
                    removeNewBillProduct={removeNewBillProduct.bind(
                      null,
                      productIndex
                    )}
                    firstProductInBill={billProductsArray[0]}
                    dispatchBillActions={dispatchBillActions}
                    billType={billType}
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
