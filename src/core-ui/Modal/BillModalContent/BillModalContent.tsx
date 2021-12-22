import { DBTables } from "../../../constants";
import { billsTableHeadData, purchasesTableHeadData } from "../../../helpers";
import { BillsDoc, PurchasesDoc } from "../../../interfaces";
import FullInfoTable from "../../Table/FullInfoTable/FullInfoTable";
import classes from "./BillModalContent.module.scss";

const BillModalContent: React.FC<{
  billId?: DBTables;
  data: BillsDoc & PurchasesDoc;
  fullData: BillsDoc[];
}> = (props) => {
  return (
    <div className={classes["bill-modal"]}>
      <div className={classes["bill-modal__header"]}>
        {props.billId === DBTables.BILLS_TABLE && (
          <h2 className={classes["bill-modal__header--date"]}>
            فحص فاتورة بتاريخ - {props.data.createdAt}
          </h2>
        )}
        {props.billId === DBTables.PURCHASES_TABLE && (
          <h2 className={classes["bill-modal__header--date"]}>
            فحص فاتورة شراء بتاريخ - {props.data.createdAt}
          </h2>
        )}
        <div className="separator separator--soft"></div>
      </div>
      <div className={classes["bill-modal__body"]}>
        <h3 className={classes["bill-modal__body--title"]}>محتوي الفاتوره</h3>
        {props.billId === DBTables.PURCHASES_TABLE && (
          <h5>{props.data.merchantName}</h5>
        )}
        <div className="responsive-y-table">
          {props.billId === DBTables.PURCHASES_TABLE && (
            <FullInfoTable
              tableId={props.billId}
              headData={purchasesTableHeadData}
              data={props.data.products}
              className="mt-md"
            />
          )}
          {props.billId === DBTables.BILLS_TABLE && (
            <FullInfoTable
              tableId={props.billId}
              headData={billsTableHeadData}
              data={props.data.products}
              className="mt-md"
            />
          )}
        </div>
      </div>

      <div className="separator separator--soft"></div>
      <div className={classes["bill-modal__footer"]}>
        <h4 className={classes["bill-modal__total"]}>
          <span className={classes["bill-modal__total--label"]}>المجموع</span>
          <span className={classes["bill-modal__total--value"]}>
            {props.data.total} L.E
          </span>
        </h4>
      </div>
    </div>
  );
};

export default BillModalContent;
