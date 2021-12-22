import React, { useEffect } from "react";
import DashboardDataCards from "../../components/DashboardCards/DashboardDataCards";
import LineChartComponent from "../../components/DashboardAnalysis/LineChart/LineChart";
import PieChartComponent from "../../components/DashboardAnalysis/PieChart/PieChart";
import IncomeTable from "../../components/IncomeTable/IncomeTable";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import FullInfoTable from "../../core-ui/Table/FullInfoTable/FullInfoTable";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { useAppSelector } from "../../hooks/use-app-selector";
import { DBTables } from "../../constants";
//prettier-ignore
import { missingProductsTableHeadData, purchasesTableHeadData } from "../../helpers";
import { addStockDataToStore } from "../../store/stock/stock-slice";
import { addMissingProductsDataToStore } from "../../store/missing-products/missing-products-slice";
import classes from "./StockPage.module.scss";
import { addPurchasesDataToStore } from "../../store/purchases/purchases-slice";

const StockPage = () => {
  const { data: missingProductsData, isLoading: missingProductsDataLoading } =
    useAppSelector((state) => state.missingProducts);
  const { data: purchasesData, isLoading: purchasesDataLoading } =
    useAppSelector((state) => state.purchases);
  const { data: billsData, isLoading: billsDataLoading } = useAppSelector(
    (state) => state.bills
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(addStockDataToStore());
    dispatch(addMissingProductsDataToStore());
    dispatch(addPurchasesDataToStore());
  }, [dispatch]);

  return (
    <div className={classes["page"]}>
      <Navigation title="المعلومات و الادارة" />
      <Sidebar />
      <div className={classes["page__content"]}>
        <div className={classes["page__data-cards-wrapper"]}>
          <DashboardDataCards />
        </div>
        <div className={classes["page__analysis-wrapper"]}>
          <div className={classes["page__analysis"]}>
            <LineChartComponent />
          </div>
          <div className={classes["page__analysis"]}>
            <PieChartComponent />
          </div>
        </div>
        {/** FAWATER TABLE */}
        <div className="grid-2x-container mb-xg mt-xg">
          <InfoTable
            tableId={DBTables.BILLS_TABLE}
            title="الفواتير"
            data={billsData}
          />
          <InfoTable
            tableId={DBTables.BILLS_TABLE}
            title="المرتجع"
            data={billsData}
          />
        </div>
        {/** MOSHTRYAT TABLE */}
        <FullInfoTable
          tableId={DBTables.PURCHASES_TABLE}
          title="أخر المشتريات"
          headData={purchasesTableHeadData}
          data={purchasesData}
          isLoading={purchasesDataLoading}
        />
        <div className="grid-3fr-container mt-xg mb-xg">
          {/** MANKOSAT TABLE */}
          <FullInfoTable
            tableId={DBTables.MISSING_PRODUCTS_TABLE}
            title={DBTables.MISSING_PRODUCTS_TABLE}
            headData={missingProductsTableHeadData}
            data={missingProductsData}
            isLoading={missingProductsDataLoading}
          />
          <IncomeTable />
        </div>
      </div>
    </div>
  );
};

export default StockPage;
