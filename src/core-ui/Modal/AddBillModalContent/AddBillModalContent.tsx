import React, { useEffect, useState } from "react";
import Switch from "../../Switch/Switch";
import { FaPlus } from "react-icons/fa";
import classes from "./AddBillModalContent.module.scss";
import AddNewProductToBill from "./AddNewProductToBill/AddNewProductToBill";
import { useAppSelector } from "../../../hooks/use-app-selector";
import { BillsDoc, SendRequestData } from "../../../interfaces";
import { BillType } from "../../../types/bills";
import useHttp from "../../../hooks/use-http";
import { sendData } from "../../../services/api";
import { COLLECTIONS } from "../../../constants";
import useProduct from "../../../hooks/use-product";
import { useAppDispatch } from "../../../hooks/use-app-dispatch";
import { addBillsData } from "../../../store/bills/bill-slice";
import useBillProductsController from "../../../hooks/use-bill-products-controller";

const AddBillModalContent: React.FC<{ hideAddBillModal: Function }> = (
  props
) => {
  const [billType, setBillType] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const {
    billProductsData,
    dispatchBillActions,
    billType: controllerBillType,
  } = useBillProductsController(
    billType ? BillType.NORMAL_BILL : BillType.RETURNED_BILL
  );

  const {
    productFormArray: billProducts,
    addProductFormData: addNewBillProduct,
    removeProductFormData: removeNewBillProduct,
  } = useProduct();

  useEffect(() => {
    console.log("billProductsData: ", billProductsData, controllerBillType);
  }, [billProductsData, controllerBillType]);

  const { total, billSelectedProducts } = useAppSelector(
    (state) => state.bills
  );

  const { sendHttpRequest: insertBill } = useHttp(sendData);

  function changeBillType<T>(event: React.FormEvent<T>) {
    setBillType((prevState) => !prevState);
  }

  const submitBillFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // BILL DATA
    const billData: BillsDoc = {
      total,
      createdAt: new Date().toString(),
      products: [...billSelectedProducts],
      type: billType ? BillType.NORMAL_BILL : BillType.RETURNED_BILL,
    };

    // INSERT BILL TO DATABASE
    insertBill({
      collectionName: COLLECTIONS.BILLS,
      data: billData,
    } as SendRequestData)
      .then((_) => {
        dispatch(addBillsData());
      })
      .then((_) => {
        props.hideAddBillModal();
      });
  };

  return (
    <div className={classes["add-bill-modal"]}>
      <div className={classes["add-bill-modal__header"]}>
        <h2 className={classes["add-bill-modal__header--date"]}>
          أضافة فاتوره
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
              {billProducts.map((productIndex, _, billProductsArray) => {
                return (
                  <AddNewProductToBill
                    key={productIndex}
                    productIndex={productIndex}
                    removeNewBillProduct={removeNewBillProduct.bind(
                      null,
                      productIndex
                    )}
                    firstProductInBill={billProductsArray[0]}
                    dispatchBillActions={dispatchBillActions}
                    billType={controllerBillType}
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
                أضف فاتوره
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

export default AddBillModalContent;
