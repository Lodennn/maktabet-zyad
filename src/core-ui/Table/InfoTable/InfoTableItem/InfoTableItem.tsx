import React, { Fragment, MouseEvent } from "react";

import {
  BillRequestAction,
  COLLECTIONS,
  DBTables,
} from "../../../../constants";

import {
  BillsDoc,
  DeleteRequestData,
  PurchasesDoc,
} from "../../../../interfaces";
import moment from "moment";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import useHttp from "../../../../hooks/use-http";
import { deleteData } from "../../../../services/api";
import { addBillsData } from "../../../../store/bills/bill-slice";
import { transformDataFromNormalBillToStock } from "../../../../store/stock/stock-slice";
import { BillType } from "../../../../types/bills";
import classes from "./InfoTableItem.module.scss";
import { formatDateByHours } from "../../../../helpers/functions";

const InfoTableItem: React.FC<{
  tableId?: string;
  admin?: boolean;
  data: BillsDoc & PurchasesDoc;
  triggerModalAction: (data: any, event: React.MouseEvent) => void;
  triggerUpdateModalAction: (data: any) => void;
  hideModal: (event: React.MouseEvent) => void;
  dispatchUpdateBill: (updateData: any) => void;
}> = (props) => {
  const dispatch = useAppDispatch();

  const { sendHttpRequest: deleteBill } = useHttp(deleteData);

  const onDeleteBasicBill = (
    bill: BillsDoc,
    event: React.MouseEvent<HTMLLIElement>
  ) => {
    // UPDATE STOCK IN DATABASE
    //prettier-ignore
    dispatch(transformDataFromNormalBillToStock({billData: bill, action: BillRequestAction.DELETE_BILL}));

    // DELETE BILL TO DATABASE
    deleteBill({
      collectionName: COLLECTIONS.BILLS,
      docId: bill.id,
    } as DeleteRequestData).then((_) => {
      dispatch(addBillsData());
    });
  };
  const onDeletePurchaseBill = (
    bill: BillsDoc,
    event: React.MouseEvent<HTMLLIElement>
  ) => {
    console.log("DELETE PURCHASE BILL: ", bill);
    // UPDATE STOCK IN DATABASE
    //prettier-ignore
    dispatch(transformDataFromNormalBillToStock({billData: bill, action: BillRequestAction.DELETE_BILL}));

    // DELETE BILL TO DATABASE
    deleteBill({
      collectionName: COLLECTIONS.PURCHASES,
      docId: bill.id,
    } as DeleteRequestData);
  };

  const billTypeClasses =
    props.data.type === BillType.NORMAL_BILL
      ? `${classes[`info-table-item__bill-type--normal`]}`
      : props.data.type === BillType.RETURNED_BILL
      ? `${classes[`info-table-item__bill-type--returned`]}`
      : null;

  return (
    <div className={classes["info-table-item"]}>
      <div className={classes["info-table-item__bill-info"]}>
        <ul className={classes["info-table-item__products-list"]}>
          {props.tableId === DBTables.PURCHASES_TABLE && (
            <h3 className={classes["info-table-item__merchant-name"]}>
              {props.data.merchantName}
            </h3>
          )}
          {props.tableId === DBTables.BILLS_TABLE && (
            <h3
              className={`${classes["info-table-item__bill-type"]} ${billTypeClasses}`}
            >
              {props.data.type}
            </h3>
          )}
          {props.tableId === DBTables.PURCHASES_TABLE &&
            props.data.products.map((product: any) => {
              return (
                <Fragment key={product.productName}>
                  <li className={classes["info-table-item__products-item"]}>
                    <span
                      className={
                        classes["info-table-item__products-item--count"]
                      }
                    >
                      {product.totalProductAmount}
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
          {props.tableId === DBTables.BILLS_TABLE &&
            props.data.type === BillType.NORMAL_BILL &&
            props.data.products.map((product: any) => {
              return (
                <Fragment key={product.id}>
                  {product.totalProductAmount ? (
                    <li className={classes["info-table-item__products-item"]}>
                      <span
                        className={
                          classes["info-table-item__products-item--count"]
                        }
                      >
                        {product.totalProductAmount}
                      </span>
                      <span
                        className={
                          classes["info-table-item__products-item--category"]
                        }
                      >
                        {product.category}
                      </span>
                    </li>
                  ) : null}
                </Fragment>
              );
            })}

          {props.tableId === DBTables.BILLS_TABLE &&
            props.data.type === BillType.RETURNED_BILL &&
            props.data.products.map((product: any) => {
              return (
                <Fragment key={product.id}>
                  {product.totalProductAmount ? (
                    <li className={classes["info-table-item__products-item"]}>
                      <span
                        className={
                          classes["info-table-item__products-item--count"]
                        }
                      >
                        {product.totalProductAmount}
                      </span>
                      <span
                        className={
                          classes["info-table-item__products-item--category"]
                        }
                      >
                        {product.category}
                      </span>
                    </li>
                  ) : null}
                </Fragment>
              );
            })}

          <div className={classes["info-table-item__bill-price"]}>
            {props.data.total} L.E
          </div>
          <p className={classes["info-table-item__bill-date"]}>
            {formatDateByHours(props.data.createdAt)}
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

          {props.admin && props.data.type !== BillType.PURCHASES_BILL && (
            <Fragment>
              <li
                className={classes["info-table-item__controls-control"]}
                onClick={() => {
                  props.triggerUpdateModalAction(props.data);
                  props.dispatchUpdateBill(props.data);
                }}
              >
                تعديل
              </li>
              <li
                className={classes["info-table-item__controls-control"]}
                onClick={onDeleteBasicBill.bind(null, props.data)}
              >
                مسح
              </li>
            </Fragment>
          )}
          {props.admin && props.data.type === BillType.PURCHASES_BILL && (
            <Fragment>
              <li
                className={classes["info-table-item__controls-control"]}
                onClick={() => {
                  props.triggerUpdateModalAction(props.data);
                  props.dispatchUpdateBill(props.data);
                }}
              >
                تعديل
              </li>
              <li
                className={classes["info-table-item__controls-control"]}
                onClick={onDeletePurchaseBill.bind(null, props.data)}
              >
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
