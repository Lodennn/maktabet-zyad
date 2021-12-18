import { Fragment } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import classes from "../StockPage/StockPage.module.scss";

const BillsPage: React.FC = () => {
  return (
    <Fragment>
      <div className={classes.page}>
        <Navigation title="الفواتير" />
        <Sidebar />
        <div className={classes["page__content"]}>
          <Wrapper>
            <InfoTable title="الفواتير" admin={true} />
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
};

export default BillsPage;
