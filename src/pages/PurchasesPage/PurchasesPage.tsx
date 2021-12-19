import { Fragment, useEffect } from "react";
import Navigation from "../../components/Layouts/Navigation/Navigation";
import Sidebar from "../../components/Layouts/Sidebar/Sidebar";
import FullInfoTable from "../../core-ui/Table/FullInfoTable/FullInfoTable";
import Wrapper from "../../core-ui/Wrapper/Wrapper";
import classes from "../StockPage/StockPage.module.scss";
import { DBTables } from "../../constants";
import { purchasesTableHeadData } from "../../helpers";
import { useAppSelector } from "../../hooks/use-app-selector";
import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { addPurchasesDataToStore } from "../../store/purchases/purchases-slice";
import Button from "../../core-ui/Button/Button";
import { FaPlus } from "react-icons/fa";
import useReadData from "../../hooks/use-read-data";
import Modal from "../../core-ui/Modal/Modal";

const PurchasesPage: React.FC = () => {
  const { data, isLoading } = useAppSelector((state) => state.purchases);

  const { showModal, hideModal, triggerModalAction } = useReadData();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(addPurchasesDataToStore());
  }, [dispatch]);
  return (
    <Fragment>
      <div className={classes.page}>
        {showModal && (
          <Modal onHide={hideModal}>
            <h3>I'M MODAL</h3>
          </Modal>
        )}
        <Navigation title="المشتريات" />
        <Sidebar />
        <div className={classes["page__content"]}>
          <Wrapper>
            <Button
              className={"btn btn--primary btn--add mt-sm mb-md"}
              icon={<FaPlus />}
              text={"أضف فاتورة شراء"}
              onClick={triggerModalAction}
            />
            <FullInfoTable
              tableId={DBTables.PURCHASES_TABLE}
              title={DBTables.PURCHASES_TABLE}
              headData={purchasesTableHeadData}
              data={data}
              isLoading={isLoading}
              admin={true}
            />
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchasesPage;
