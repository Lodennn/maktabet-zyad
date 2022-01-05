import React, { Fragment, useState } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import DashboardTabs from "../../components/DashboardTabs/DashboardTabs";
import classes from "./HomePage.module.scss";
import FullInfoTable from "../../core-ui/Table/FullInfoTable/FullInfoTable";
import { DBTables } from "../../constants";
import {
  stockTableHeadData,
  missingProductsTableHeadData,
  outlaysTableHeadData,
} from "../../helpers";

import { useAppSelector } from "../../hooks/use-app-selector";
import StoreSearchForm from "../../components/StoreSearchForm/StoreSearchForm";
import InfoTable from "../../core-ui/Table/InfoTable/InfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import { FaPlus } from "react-icons/fa";
import useReadData from "../../hooks/use-read-data";
import Modal from "../../core-ui/Modal/Modal";
import AddBillModalContent from "../../core-ui/Modal/AddBillModalContent/AddBillModalContent";
import Button from "../../core-ui/Button/Button";
import useDate from "../../hooks/use-date";
import {
  dateMe,
  formatDateByDay,
  formatNumber,
  resetDate,
} from "../../helpers/functions";
import moment from "moment";
import AddOutlayModalContent from "../../core-ui/Modal/AddOutlayModalContent/AddOutlayModalContent";

const HomePage = () => {
  const { productsInStore, isLoading, filteredStockData } = useAppSelector(
    (state) => state.stock
  );
  //prettier-ignore
  const { data: billsData, dailyBillsTotal } = useAppSelector((state) => state.bills);
  //prettier-ignore
  const { data: outlaysData, isLoading: outlaysIsLoading, dailtyOutlaysTotal } = useAppSelector((state) => state.outlays);

  const { data: missingProductsData, isLoading: missingProductsDataLoading } =
    useAppSelector((state) => state.missingProducts);

  //prettier-ignore
  const [displayContent, setDisplayContent] = useState<DBTables>(DBTables.STOCK_TABLE);

  const getDisplayContentValue = (content: DBTables) => {
    setDisplayContent(content);
  };

  const { showModal, triggerModalAction, hideModal } = useReadData();
  const {
    showModal: outsModal,
    triggerModalAction: triggerOutsModal,
    hideModal: hideOutsModal,
  } = useReadData();

  const { dateValue, onChangeDateHandler } = useDate();

  const filteredByDateBillsData = billsData.filter(
    (bill) => resetDate(dateMe(bill.createdAt)) === resetDate(dateValue)
  );

  return (
    <div className={classes["home-page"]}>
      {showModal && (
        <Modal onHide={hideModal}>
          <AddBillModalContent hideAddBillModal={hideModal} />
        </Modal>
      )}
      {outsModal && (
        <Modal onHide={hideOutsModal}>
          <AddOutlayModalContent hideAddOutlayModal={hideOutsModal} />
        </Modal>
      )}

      <Navigation title="المتجر" />
      <div className={classes["home-page__content"]}>
        <Wrapper>
          <div className={classes["home-page__intro"]}>
            <div className={classes["home-page__intro--wrapper"]}>
              <h2 className={classes["home-page__full-date"]}>
                اليوم, {formatDateByDay(new Date())}{" "}
                {moment(new Date()).format("L")}
              </h2>
              <Button
                className={"btn btn--primary btn--add mt-sm"}
                icon={<FaPlus />}
                text={"أضف فاتوره"}
                onClick={triggerModalAction}
              />
            </div>
            <div className={classes["home-page__income"]}>
              {formatNumber(dailyBillsTotal - dailtyOutlaysTotal)}
            </div>
          </div>
          <hr className="separator separator--soft" />
          <DashboardTabs getDisplayContentValue={getDisplayContentValue} />
          {/** STORE TAB */}
          {displayContent === DBTables.STOCK_TABLE && (
            <Fragment>
              <StoreSearchForm />
              <FullInfoTable
                tableId={DBTables.STOCK_TABLE}
                headData={stockTableHeadData}
                data={filteredStockData}
                isLoading={isLoading}
                className="mt-md"
              />
            </Fragment>
          )}
          {/** STORE TAB */}
          {/** FAWATER TAB */}
          {displayContent === DBTables.BILLS_TABLE && (
            <Fragment>
              <InfoTable
                tableId={DBTables.BILLS_TABLE}
                className="mt-md"
                admin={true}
                data={filteredByDateBillsData}
                onChangeDateHandler={onChangeDateHandler}
                dateValue={dateValue}
              />
            </Fragment>
          )}
          {/** FAWATER TAB */}
          {/** MANKOSAT TAB */}
          {displayContent === DBTables.MISSING_PRODUCTS_TABLE && (
            <Fragment>
              <FullInfoTable
                tableId={DBTables.MISSING_PRODUCTS_TABLE}
                headData={missingProductsTableHeadData}
                data={missingProductsData}
                isLoading={missingProductsDataLoading}
                className="mt-md"
              />
            </Fragment>
          )}
          {/** MANKOSAT TAB */}
          {/** OUTS TAB */}
          {displayContent === DBTables.OUTLAYS_TABLE && (
            <Fragment>
              <Button
                className={"btn btn--default btn--add mt-sm mb-md"}
                icon={<FaPlus />}
                text={"أضف مصروفات"}
                onClick={triggerOutsModal}
              />
              <FullInfoTable
                tableId={DBTables.OUTLAYS_TABLE}
                headData={outlaysTableHeadData}
                data={outlaysData}
                isLoading={outlaysIsLoading}
                className="mt-md"
                admin={true}
              />
            </Fragment>
          )}
          {/** OUTS TAB */}
        </Wrapper>
      </div>
    </div>
  );
};

export default HomePage;
