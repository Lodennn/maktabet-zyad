import React, { useState } from "react";
import Switch from "../../Switch/Switch";
import { FaPlus } from "react-icons/fa";
import classes from "./AddBillModalContent.module.scss";
import AddNewProductToBill from "./AddNewProductToBill/AddNewProductToBill";

const AddBillModalContent: React.FC = () => {
  const [billType, setBillType] = useState<boolean>(true);

  function changeBillType<T>(event: React.FormEvent<T>) {
    setBillType((prevState) => !prevState);
  }

  return (
    <div className={classes["add-bill-modal"]}>
      <div className={classes["add-bill-modal__header"]}>
        <h2 className={classes["add-bill-modal__header--date"]}>
          أضافة فاتوره
        </h2>
        <div className="separator separator--soft"></div>
      </div>
      <div className={classes["add-bill-modal__body"]}>
        <form className={classes["add-bill-form"]}>
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
                  onChange={changeBillType}
                  className={classes["add-bill-form__checkbox"]}
                />
                <Switch billType={billType} changeBillType={changeBillType} />
              </div>
            </div>
          </div>
          <div className="form-control">
            <h4 className="form-title">بيانات المنتج</h4>

            {/** PRODUCTS */}
            <div className={classes["add-bill-form__products"]}>
              {/** PRODUCT *************************** */}
              <AddNewProductToBill />
              {/** PRODUCT *************************** */}
            </div>
            {/** PRODUCTS */}
          </div>
          <div className={classes["add-bill-form__actions"]}>
            <button className="btn btn--primary btn--add">
              <span className={`fix-icon`}>
                <FaPlus />
              </span>
              أضف منتج
            </button>
            <p className={classes["add-bill-form__action--total"]}>
              المجموع 210
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBillModalContent;
