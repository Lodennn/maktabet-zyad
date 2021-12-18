import { DBTables } from "../../../constants";
import { billsTableHeadData } from "../../../helpers";
import FullInfoTable from "../../Table/FullInfoTable/FullInfoTable";
import classes from "./BillModalContent.module.scss";

const BillModalContent: React.FC<{ data: any; fullData: any[] }> = (props) => {
  return (
    <div className={classes["bill-modal"]}>
      <div className={classes["bill-modal__header"]}>
        <h2 className={classes["bill-modal__header--date"]}>
          فحص فاتورة بتاريخ - {props.data.createdAt}
        </h2>
        <div className="separator separator--soft"></div>
      </div>
      <div className={classes["bill-modal__body"]}>
        <h3 className={classes["bill-modal__body--title"]}>محتوي الفاتوره</h3>
        <div className="responsive-y-table">
          <FullInfoTable
            tableId={DBTables.BILLS_TABLE}
            headData={billsTableHeadData}
            data={props.fullData}
            className="mt-md"
          />
        </div>
      </div>

      <div className="separator separator--soft"></div>
      <div className={classes["bill-modal__footer"]}>
        <h4 className={classes["bill-modal__total"]}>
          <span className={classes["bill-modal__total--label"]}>المجموع</span>
          <span className={classes["bill-modal__total--value"]}>128 L.E</span>
        </h4>
      </div>
    </div>
  );
};

export default BillModalContent;
