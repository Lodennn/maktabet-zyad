import { Fragment } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import classes from "../StockPage/StockPage.module.scss";

const ReturnedBillsPage: React.FC = () => {
  return (
    <Fragment>
      <div className={classes.page}>
        <Navigation title="المرتجع" />
        <Sidebar />
        <div className={classes["page__content"]}>
          <Wrapper>
            <InfoTable title="المرتجع" admin={true} />
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
};

export default ReturnedBillsPage;
