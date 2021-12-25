import React, { Fragment, useEffect, useState } from "react";
import { DBTables } from "../../../constants";
import useDate from "../../../hooks/use-date";
import useReadData from "../../../hooks/use-read-data";
import { BillType } from "../../../types/bills";
import FilterByDate from "../../FilterByDate/FilterByDate";
import BillModalContent from "../../Modal/BillModalContent/BillModalContent";
import Modal from "../../Modal/Modal";
import UpdateBillModalContent from "../../Modal/UpdateBillModalContent/UpdateBillModalContent";
import classes from "./InfoTable.module.scss";
import InfoTableItem from "./InfoTableItem/InfoTableItem";

const InfoTable: React.FC<{
  tableId?: DBTables;
  title?: string;
  data: any[];
  className?: string;
  admin?: boolean;
  onChangeDateHandler?: (e: React.FormEvent<HTMLInputElement>) => void;
}> = (props) => {
  const { showModal, triggerModalAction, hideModal, readData } = useReadData();
  const {
    showModal: showUpdateModal,
    triggerModalAction: triggerUpdateModalAction,
    hideModal: hideUpdateModal,
    readData: updateData,
  } = useReadData();

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
      {showUpdateModal && (
        <Modal onHide={hideUpdateModal}>
          {updateData && (
            <UpdateBillModalContent
              data={updateData}
              hideUpdateModal={hideUpdateModal}
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
          <FilterByDate onChangeDateHandler={props.onChangeDateHandler} />
        </div>
        {props.data.length > 0 ? (
          props.data.map((data) => {
            return (
              <InfoTableItem
                tableId={props.tableId}
                key={data.id}
                admin={props.admin}
                data={data}
                hideModal={hideModal}
                triggerModalAction={triggerModalAction}
                triggerUpdateModalAction={triggerUpdateModalAction}
              />
            );
          })
        ) : (
          <h2 className="not-founded">لا يوجد فواتير</h2>
        )}
      </div>
    </Fragment>
  );
};

export default InfoTable;
