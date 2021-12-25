import { useState } from "react";
import { AiTwotoneCalendar } from "react-icons/ai";
import { maxDate } from "../../helpers/functions";

import classes from "./FilterByDate.module.scss";
const FilterByDate: React.FC<{
  onChangeDateHandler?: (e: React.FormEvent<HTMLInputElement>) => void;
}> = (props) => {
  return (
    <div className={classes["search-date"]}>
      <input
        type="date"
        className={classes["search-date--input"]}
        max={maxDate()}
        onChange={props.onChangeDateHandler}
      />
      <span className={classes["search-date--label"]}>بحث بالتاريخ</span>
      <span className={`${classes["search-date--icon"]} fix-icon`}>
        <AiTwotoneCalendar />
      </span>
    </div>
  );
};

export default FilterByDate;
