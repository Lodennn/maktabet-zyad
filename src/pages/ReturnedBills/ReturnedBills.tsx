import { Fragment } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import { useAppSelector } from "../../hooks/use-app-selector";
import { DBTables } from "../../constants";
import classes from "../StockPage/StockPage.module.scss";
import { BillType } from "../../types/bills";
import { BillsDoc } from "../../interfaces";

const ReturnedBillsPage: React.FC = () => {
  const { data: billsData } = useAppSelector((state) => state.bills);
  const returnedBillsData = billsData.filter(
    (bill: BillsDoc) => bill.type === BillType.RETURNED_BILL
  );
  return (
    <Fragment>
      <div className={classes.page}>
        <Navigation title="المرتجع" />
        <Sidebar />
        <div className={classes["page__content"]}>
          <Wrapper>
            <InfoTable
              tableId={DBTables.BILLS_TABLE}
              title="المرتجع"
              admin={true}
              data={returnedBillsData}
            />
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
};

export default ReturnedBillsPage;
