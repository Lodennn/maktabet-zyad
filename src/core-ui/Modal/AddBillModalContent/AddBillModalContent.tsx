import React, { useState } from "react";
import Switch from "../../Switch/Switch";
import { FaPlus } from "react-icons/fa";
import classes from "./AddBillModalContent.module.scss";
import AddNewProductToBill from "./AddNewProductToBill/AddNewProductToBill";
import { useAppSelector } from "../../../hooks/use-app-selector";

const AddBillModalContent: React.FC = () => {
  const [billType, setBillType] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [billProducts, setBillProducts] = useState<number[]>([counter]);

  const { total } = useAppSelector((state) => state.bills);

  function changeBillType<T>(event: React.FormEvent<T>) {
    setBillType((prevState) => !prevState);
  }

  function addNewBillProduct(event: React.MouseEvent<HTMLButtonElement>) {
    setCounter((prevState) => prevState + 1);
    setBillProducts((prevState) => prevState.concat(counter + 1));
  }
  function removeNewBillProduct(productIndex: number) {
    setBillProducts((prevState) =>
      prevState.filter((productId) => {
        return productId !== productIndex;
      })
    );
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
                    removeNewBillProduct={removeNewBillProduct}
                    firstProductInBill={billProductsArray[0]}
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
              <button type="button" className="btn btn--primary btn--add">
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
                  {total}
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
