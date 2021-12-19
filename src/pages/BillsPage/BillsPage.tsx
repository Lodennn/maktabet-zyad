import { Fragment } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import { useAppSelector } from "../../hooks/use-app-selector";
import classes from "../StockPage/StockPage.module.scss";

const BillsPage: React.FC = () => {
  const { data: billsData } = useAppSelector((state) => state.bills);

  return (
    <Fragment>
      <div className={classes.page}>
        <Navigation title="الفواتير" />
        <Sidebar />
        <div className={classes["page__content"]}>
          <Wrapper>
            <InfoTable title="الفواتير" admin={true} data={billsData} />
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
};

export default BillsPage;
