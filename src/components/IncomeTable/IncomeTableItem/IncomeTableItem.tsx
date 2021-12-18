import React from "react";
import classes from "./IncomeTableItem.module.scss";

const IncomeTableItem: React.FC<{ value: string; date: string }> = (props) => {
  return (
    <div className={classes["income-table-item"]}>
      <span className={classes["income-table-item--value"]}>
        {props.value} L.E
      </span>
      <span className={classes["income-table-item--date"]}>{props.date}</span>
    </div>
  );
};

export default IncomeTableItem;
