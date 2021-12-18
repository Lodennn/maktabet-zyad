import React from "react";
import IncomeTableItem from "./IncomeTableItem/IncomeTableItem";
import FilterByDate from "../../core-ui/FilterByDate/FilterByDate";
import classes from "./IncomeTable.module.scss";

const IncomeTable: React.FC = () => {
  return (
    <div className={classes["income-table"]}>
      <div className={classes["income-table__intro"]}>
        <div className={classes["income-table__title"]}>الإيراد</div>

        <FilterByDate />
      </div>
      <div className={classes["income-table__wrapper"]}>
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
        <IncomeTableItem value="75" date="27/10/2022" />
      </div>
    </div>
  );
};

export default IncomeTable;
