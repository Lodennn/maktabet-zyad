import classes from "./StoreSearchForm.module.scss";

const StoreSearchForm: React.FC = () => {
  return (
    <form className={`${classes["store-form"]} mt-xg`}>
      <input
        type="search"
        className={classes["store-form__input"]}
        placeholder="بحث بأسم المنتج"
      />
      <select className={classes["store-form__filter"]}>
        <option>فيلتر</option>
        <option>قلم</option>
        <option>كراس</option>
        <option>جلاد</option>
      </select>
    </form>
  );
};

export default StoreSearchForm;
