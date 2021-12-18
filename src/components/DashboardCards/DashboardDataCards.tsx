import React, { Fragment } from "react";
import { MdLocalGroceryStore } from "react-icons/md";
import { BsCashCoin, BsCartXFill } from "react-icons/bs";
import { RiBillFill } from "react-icons/ri";
import classes from "./DashboardDataCards.module.scss";

const DashboardDataCard: React.FC = () => {
  return (
    <Fragment>
      {/** CARD #1 */}
      <div
        className={`${classes["dashboard-data-card"]} ${
          classes[`dashboard-data-card--1`]
        }`}
      >
        <h4 className={classes["dashboard-data-card__title"]}>
          <span className={`${classes["dashboard-data-card__icon"]} fix-icon`}>
            <MdLocalGroceryStore />
          </span>
          <span className={classes["dashboard-data-card__text"]}>البضاعه</span>
        </h4>
        <span className={classes["dashboard-data-card__value"]}>10.000</span>
      </div>
      {/** CARD #2 */}
      <div
        className={`${classes["dashboard-data-card"]} ${
          classes[`dashboard-data-card--3`]
        }`}
      >
        <h4 className={classes["dashboard-data-card__title"]}>
          <span className={`${classes["dashboard-data-card__icon"]} fix-icon`}>
            <BsCashCoin />
          </span>
          <span className={classes["dashboard-data-card__text"]}>الارباح</span>
        </h4>
        <span className={classes["dashboard-data-card__value"]}>16.000</span>
      </div>
      {/** CARD #3 */}
      <div
        className={`${classes["dashboard-data-card"]} ${
          classes[`dashboard-data-card--2`]
        }`}
      >
        <h4 className={classes["dashboard-data-card__title"]}>
          <span className={`${classes["dashboard-data-card__icon"]} fix-icon`}>
            <RiBillFill />
          </span>
          <span className={classes["dashboard-data-card__text"]}>الفواتير</span>
        </h4>
        <span className={classes["dashboard-data-card__value"]}>1037</span>
      </div>
      {/** CARD #4 */}
      <div
        className={`${classes["dashboard-data-card"]} ${
          classes[`dashboard-data-card--4`]
        }`}
      >
        <h4 className={classes["dashboard-data-card__title"]}>
          <span className={`${classes["dashboard-data-card__icon"]} fix-icon`}>
            <BsCartXFill />
          </span>
          <span className={classes["dashboard-data-card__text"]}>
            المنقوصات
          </span>
        </h4>
        <span className={classes["dashboard-data-card__value"]}>5</span>
      </div>
    </Fragment>
  );
};

export default DashboardDataCard;
