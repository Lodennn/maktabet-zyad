import React, { Fragment, MouseEvent } from "react";
import classes from "./InfoTableItem.module.scss";

const InfoTableItem: React.FC<{
  admin?: boolean;
  data: any;
  triggerModalAction: (data: any, event: React.MouseEvent) => void;
  hideModal: (event: React.MouseEvent) => void;
}> = (props) => {
  return (
    <div className={classes["info-table-item"]}>
      <div className={classes["info-table-item__bill-info"]}>
        <ul className={classes["info-table-item__products-list"]}>
          {props.data.products.map((product: any) => {
            return (
              <Fragment key={product.id}>
                <li className={classes["info-table-item__products-item"]}>
                  <span
                    className={classes["info-table-item__products-item--count"]}
                  >
                    {product.count}
                  </span>
                  <span
                    className={
                      classes["info-table-item__products-item--category"]
                    }
                  >
                    {product.category}
                  </span>
                </li>
              </Fragment>
            );
          })}
          <div className={classes["info-table-item__bill-price"]}>
            {props.data.price} L.E
          </div>
          <p className={classes["info-table-item__bill-date"]}>
            {props.data.createdAt}
          </p>
        </ul>
      </div>
      <div className={classes["info-table-item__controls"]}>
        <ul className={classes["info-table-item__controls-list"]}>
          <li
            className={classes["info-table-item__controls-control"]}
            onClick={props.triggerModalAction.bind(null, props.data)}
          >
            فحص
          </li>

          {props.admin && (
            <Fragment>
              <li className={classes["info-table-item__controls-control"]}>
                تعديل
              </li>
              <li className={classes["info-table-item__controls-control"]}>
                مسح
              </li>
            </Fragment>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InfoTableItem;
