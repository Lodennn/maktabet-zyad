import React, { Fragment } from "react";
import { DBTables } from "../../../constants";
import useReadData from "../../../hooks/use-read-data";
import FilterByDate from "../../FilterByDate/FilterByDate";
import BillModalContent from "../../Modal/BillModalContent/BillModalContent";
import Modal from "../../Modal/Modal";
import classes from "./InfoTable.module.scss";
import InfoTableItem from "./InfoTableItem/InfoTableItem";

const InfoTable: React.FC<{
  tableId?: DBTables;
  title?: string;
  data: any[];
  className?: string;
  admin?: boolean;
}> = (props) => {
  const { showModal, triggerModalAction, hideModal, readData } = useReadData();
  console.log("readData: InfoTable: ", readData);
  return (
    <Fragment>
      {showModal && (
        <Modal onHide={hideModal}>
          {readData && (
            <BillModalContent
              billId={props.tableId}
              data={readData}
              fullData={props.data}
            />
          )}
        </Modal>
      )}
      <div className={`${classes["info-table"]} ${props.className}`}>
        <div className={classes["info-table__header"]}>
          {props.title && (
            <h3 className={classes["info-table__header--title"]}>
              {props.title}
            </h3>
          )}
          <FilterByDate />
        </div>
        {props.data.map((data) => {
          return (
            <InfoTableItem
              tableId={props.tableId}
              key={data.id}
              admin={props.admin}
              data={data}
              hideModal={hideModal}
              triggerModalAction={triggerModalAction}
            />
          );
        })}
      </div>
    </Fragment>
  );
};

export default InfoTable;
