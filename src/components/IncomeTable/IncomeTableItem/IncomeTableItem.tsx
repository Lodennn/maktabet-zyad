import React from "react";
import { formatFullDate, formatNumber } from "../../../helpers/functions";
import classes from "./IncomeTableItem.module.scss";

const IncomeTableItem: React.FC<{ income: number; date: string }> = (props) => {
  return (
    <div className={classes["income-table-item"]}>
      <span className={classes["income-table-item--value"]}>
        {formatNumber(props.income)}
      </span>
      <span className={classes["income-table-item--date"]}>
        {formatFullDate(props.date)}
      </span>
    </div>
  );
};

export default IncomeTableItem;
