import moment from "moment";
import { DBTables } from "../../constants";
import FullInfoTable from "../../core-ui/Table/FullInfoTable/FullInfoTable";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import {
  missingProductsTableHeadData,
  outlaysTableHeadData,
} from "../../helpers";
import { formatDateByDay, formatNumber } from "../../helpers/functions";
import { useAppSelector } from "../../hooks/use-app-selector";
import classes from "./ReportsPage.module.scss";

const ReportsPage: React.FC = () => {
  //prettier-ignore
  const { data: billsData, dailyBillsTotal } = useAppSelector((state) => state.bills);
  //prettier-ignore
  const { data: outlaysData, isLoading: outlaysIsLoading } = useAppSelector((state) => state.outlays);
  //prettier-ignore
  const { data: missingProductsData, isLoading: missingProductsIsLoading } = useAppSelector((state) => state.missingProducts);
  //prettier-ignore
  const { data: purchaseData } = useAppSelector((state) => state.purchases);

  return (
    <div className={classes.report}>
      <Wrapper>
        <header className={classes["report__header"]}>
          <h1 className={classes["report__header--main"]}>
            تقرير عن يوم {formatDateByDay(new Date())}{" "}
            {moment(new Date()).format("L")}
          </h1>
          <h3 className={`${classes["report__header--income"]} mt-sm`}>
            <span className="label">الإيراد</span>
            <span className="value">{formatNumber(dailyBillsTotal)}</span>
          </h3>
        </header>
        <hr className="separator separator--soft" />
        <div className={classes["report__section"]}>
          <header className={`${classes["report__header"]} mb-sm`}>
            <h3 className={`${classes["report__header--main"]} mt-sm`}>
              <span className="label">الفواتير</span>
              <span className="value">
                {formatNumber(billsData.length, "d")}
              </span>
            </h3>
          </header>
          {/** BILLS TABLE */}
          {billsData.length > 0 ? (
            <InfoTable
              tableId={DBTables.BILLS_TABLE}
              title="الفواتير"
              data={billsData}
            />
          ) : (
            <h2 className="not-founded">لا يوجد فواتير</h2>
          )}
        </div>
        <hr className="separator separator--soft" />
        <div className={classes["report__section"]}>
          <header className={`${classes["report__header"]} mb-sm`}>
            <h3 className={`${classes["report__header--main"]} mt-sm`}>
              <span className="label">الخوارج</span>
              <span className="value">
                {formatNumber(outlaysData.length, "d")}
              </span>
            </h3>
          </header>
          {/** PURCHASE BILLS TABLE */}
          {outlaysData.length > 0 ? (
            <FullInfoTable
              tableId={DBTables.OUTLAYS_TABLE}
              headData={outlaysTableHeadData}
              data={outlaysData}
              isLoading={outlaysIsLoading}
              className="mt-md"
            />
          ) : (
            <h2 className="not-founded">لا يوجد فواتير شراء</h2>
          )}
        </div>
        <hr className="separator separator--soft" />
        <div className={classes["report__section"]}>
          <header className={`${classes["report__header"]} mb-sm`}>
            <h3 className={`${classes["report__header--main"]} mt-sm`}>
              <span className="label">فواتير الشراء</span>
              <span className="value">
                {formatNumber(purchaseData.length, "d")}
              </span>
            </h3>
          </header>
          {/** PURCHASE BILLS TABLE */}
          {purchaseData.length > 0 ? (
            <InfoTable
              tableId={DBTables.PURCHASES_TABLE}
              title="فواتير الشراء"
              data={purchaseData}
            />
          ) : (
            <h2 className="not-founded">لا يوجد فواتير شراء</h2>
          )}
        </div>
        <hr className="separator separator--soft" />
        <div className={classes["report__section"]}>
          <header className={`${classes["report__header"]} mb-sm`}>
            <h3 className={`${classes["report__header--main"]} mt-sm`}>
              <span className="label">المنقوصات</span>
              <span className="value">
                {formatNumber(missingProductsData.length, "d")}
              </span>
            </h3>
          </header>
          {/** PURCHASE BILLS TABLE */}
          {missingProductsData.length > 0 ? (
            <FullInfoTable
              tableId={DBTables.MISSING_PRODUCTS_TABLE}
              headData={missingProductsTableHeadData}
              data={missingProductsData}
              isLoading={missingProductsIsLoading}
              className="mt-md"
            />
          ) : (
            <h2 className="not-founded">لا يوجد منقوصات</h2>
          )}
        </div>
        <hr className="separator separator--soft" />
      </Wrapper>
    </div>
  );
};

export default ReportsPage;
