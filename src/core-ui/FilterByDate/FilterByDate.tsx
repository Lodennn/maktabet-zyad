import { AiTwotoneCalendar } from "react-icons/ai";

import classes from "./FilterByDate.module.scss";
const FilterByDate: React.FC = () => {
  return (
    <div className={classes["search-date"]}>
      <input type="date" className={classes["search-date--input"]} />
      <span className={classes["search-date--label"]}>بحث بالتاريخ</span>
      <span className={`${classes["search-date--icon"]} fix-icon`}>
        <AiTwotoneCalendar />
      </span>
    </div>
  );
};

export default FilterByDate;
