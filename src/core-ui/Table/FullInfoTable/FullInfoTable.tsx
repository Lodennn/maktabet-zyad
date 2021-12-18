import React, { Fragment } from "react";
import { DBTables } from "../../../constants";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import BillsTableData from "./BillsTableData/BillsTableData";
import classes from "./FullInfoTable.module.scss";
import MissingProductsTableData from "./MissingProductsTableData/StockTableData";
import PurchasesTableData from "./PurchasingTableData/PurchasesTableData";
import StockTableData from "./StockTableData/StockTableData";

const FullInfoTable: React.FC<{
  tableId: DBTables;
  title?: string;
  data: any[];
  headData: string[];
  isLoading?: boolean;
  className?: string;
  admin?: boolean;
}> = (props) => {
  return (
    <Fragment>
      {props.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={`${props.className}`}>
          <table
            className={`${classes["stock-table"]} table ${
              props.tableId === DBTables.PURCHASES_TABLE
                ? "table-responsive"
                : null
            }`}
          >
            {props.title && <caption>{props.title}</caption>}
            <thead>
              <tr>
                {props.headData.map((headData) => (
                  <th key={headData}>{headData}</th>
                ))}
                {props.admin && (
                  <Fragment>
                    <th>Actions</th>
                  </Fragment>
                )}
              </tr>
            </thead>
            <tbody>
              {props.tableId === DBTables.STOCK_TABLE &&
                props.data.map((dataItem) => (
                  <StockTableData
                    key={dataItem.id}
                    dataItem={dataItem}
                    admin={props.admin}
                  />
                ))}
              {props.tableId === DBTables.BILLS_TABLE &&
                props.data.map((dataItem) => (
                  <BillsTableData
                    key={dataItem.id}
                    dataItem={dataItem}
                    admin={props.admin}
                  />
                ))}
              {props.tableId === DBTables.PURCHASES_TABLE &&
                props.data.map((dataItem) => (
                  <PurchasesTableData
                    key={dataItem.id}
                    dataItem={dataItem}
                    admin={props.admin}
                  />
                ))}
              {props.tableId === DBTables.MISSING_PRODUCTS_TABLE &&
                props.data.map((dataItem) => (
                  <MissingProductsTableData
                    key={dataItem.id}
                    dataItem={dataItem}
                    admin={props.admin}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
};

export default FullInfoTable;
