import React, { Fragment } from "react";
import useReadData from "../../../hooks/use-read-data";
import FilterByDate from "../../FilterByDate/FilterByDate";
import BillModalContent from "../../Modal/BillModalContent/BillModalContent";
import Modal from "../../Modal/Modal";
import classes from "./InfoTable.module.scss";
import InfoTableItem from "./InfoTableItem/InfoTableItem";

const DUMMY_DATA = [
  {
    id: 1,
    products: [
      { id: 1, category: "قلم", count: 3 },
      { id: 2, category: "كراس", count: 2 },
      { id: 3, category: "زينه", count: 12 },
    ],
    price: 105,
    createdAt: "27/10/2022",
  },
  {
    id: 2,
    products: [
      { id: 4, category: "قلم", count: 6 },
      { id: 5, category: "كراس", count: 10 },
      { id: 6, category: "زينه", count: 2 },
    ],
    price: 50,
    createdAt: "27/10/2022",
  },
  {
    id: 3,
    products: [
      { id: 7, category: "قلم", count: 6 },
      { id: 8, category: "كراس", count: 10 },
      { id: 9, category: "زينه", count: 2 },
    ],
    price: 35,
    createdAt: "27/10/2022",
  },
  {
    id: 4,
    products: [
      { id: 10, category: "قلم", count: 6 },
      { id: 11, category: "كراس", count: 10 },
      { id: 12, category: "زينه", count: 2 },
    ],
    price: 35,
    createdAt: "27/10/2022",
  },
  {
    id: 5,
    products: [
      { id: 13, category: "قلم", count: 6 },
      { id: 14, category: "كراس", count: 10 },
      { id: 15, category: "زينه", count: 2 },
    ],
    price: 35,
    createdAt: "27/10/2022",
  },
];

const InfoTable: React.FC<{
  title?: string;
  data?: string[];
  className?: string;
  admin?: boolean;
}> = (props) => {
  const { showModal, triggerModalAction, hideModal, readData } = useReadData();

  return (
    <Fragment>
      {showModal && (
        <Modal onHide={hideModal}>
          {readData && (
            <BillModalContent data={readData} fullData={DUMMY_DATA} />
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
        {DUMMY_DATA.map((data) => {
          return (
            <InfoTableItem
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
