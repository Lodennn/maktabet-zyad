import { Fragment } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import { useAppSelector } from "../../hooks/use-app-selector";
import classes from "../StockPage/StockPage.module.scss";

const ReturnedBillsPage: React.FC = () => {
  const { data: billsData } = useAppSelector((state) => state.bills);
  return (
    <Fragment>
      <div className={classes.page}>
        <Navigation title="المرتجع" />
        <Sidebar />
        <div className={classes["page__content"]}>
          <Wrapper>
            <InfoTable title="المرتجع" admin={true} data={billsData} />
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
};

export default ReturnedBillsPage;
