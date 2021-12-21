import React, { Fragment, useState } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import DashboardTabs from "../../components/DashboardTabs/DashboardTabs";
import classes from "./HomePage.module.scss";
import FullInfoTable from "../../core-ui/Table/FullInfoTable/FullInfoTable";
import { DBTables } from "../../constants";
import {
  stockTableHeadData,
  missingProductsTableHeadData,
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

const HomePage = () => {
  const { data: stockData, isLoading } = useAppSelector((state) => state.stock);
  //prettier-ignore
  const { data: billsData, isLoading: billsIsLoading } = useAppSelector((state) => state.bills);
  const { data: missingProductsData, isLoading: missingProductsDataLoading } =
    useAppSelector((state) => state.missingProducts);

  const [displayContent, setDisplayContent] = useState<DBTables>(
    DBTables.STOCK_TABLE
  );

  const getDisplayContentValue = (content: DBTables) => {
    setDisplayContent(content);
  };

  const { showModal, triggerModalAction, hideModal } = useReadData();

  return (
    <div className={classes["home-page"]}>
      {showModal && (
        <Modal onHide={hideModal}>
          <AddBillModalContent hideAddBillModal={hideModal} />
        </Modal>
      )}
      <Navigation title="المتجر" />
      <div className={classes["home-page__content"]}>
        <Wrapper>
          <div className={classes["home-page__intro"]}>
            <div className={classes["home-page__intro--wrapper"]}>
              <h2 className={classes["home-page__full-date"]}>
                اليوم, الأحد 27/10/2022
              </h2>
              <Button
                className={"btn btn--primary btn--add mt-sm"}
                icon={<FaPlus />}
                text={"أضف فاتوره"}
                onClick={triggerModalAction}
              />
            </div>
            <div className={classes["home-page__income"]}>25 L.E</div>
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
                data={stockData}
                isLoading={isLoading}
                className="mt-md"
              />
            </Fragment>
          )}
          {/** STORE TAB */}
          {/** FAWATER TAB */}
          {displayContent === DBTables.BILLS_TABLE && (
            <Fragment>
              <StoreSearchForm />

              <InfoTable
                tableId={DBTables.BILLS_TABLE}
                className="mt-md"
                admin={true}
                data={billsData}
              />
            </Fragment>
          )}
          {/** FAWATER TAB */}
          {/** MANKOSAT TAB */}
          {displayContent === DBTables.MISSING_PRODUCTS_TABLE && (
            <Fragment>
              <StoreSearchForm />

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
        </Wrapper>
      </div>
    </div>
  );
};

export default HomePage;
