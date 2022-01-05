import React from "react";
import IncomeTableItem from "./IncomeTableItem/IncomeTableItem";
import FilterByDate from "../../core-ui/FilterByDate/FilterByDate";
import classes from "./IncomeTable.module.scss";
import { ReportsDoc } from "../../interfaces";
import { Link } from "react-router-dom";

const IncomeTable: React.FC<{ data: ReportsDoc[] }> = (props) => {
  return (
    <div className={classes["income-table"]}>
      <div className={classes["income-table__intro"]}>
        <div className={classes["income-table__title"]}>الإيراد</div>

        <FilterByDate />
      </div>
      <div className={classes["income-table__wrapper"]}>
        {props.data.map((report: ReportsDoc) => {
          return (
            <Link
              className={classes["income-table__link"]}
              to={`/report/${report.id}`}
              key={report.id}
            >
              <IncomeTableItem income={report.income} date={report.createdAt} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeTable;
