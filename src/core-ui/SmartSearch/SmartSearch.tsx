import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { useAppSelector } from "../../hooks/use-app-selector";
import { StockDoc } from "../../interfaces";
import { stockActions } from "../../store/stock/stock-slice";
import classes from "./SmartSearch.module.scss";

const SmartSearch: React.FC<{
  getSearchValue: Function;
  updateValue?: string;
}> = (props) => {
  //prettier-ignore
  const [searchValue, setSearchValue] = useState<string>(!!props.updateValue ? props.updateValue : '');

  const [showSmartSearch, setShowSmartSearch] = useState<boolean>(false);

  const { filteredStockData } = useAppSelector((state) => state.stock);

  const dispatch = useAppDispatch();

  const search = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;

    setSearchValue(target.value);
    if (target.value === "") {
      setShowSmartSearch(false);
      return;
    }
    dispatch(stockActions.filterStockData({ searchValue }));
    setShowSmartSearch(true);
  };
  const selectSearchResult = (
    searchResult: StockDoc,
    event: React.MouseEvent<HTMLLIElement>
  ): void => {
    setSearchValue(searchResult.productName);
    setShowSmartSearch(false);

    props.getSearchValue(searchResult);

    dispatch(stockActions.filterStockData({ searchValue: "" }));
  };

  return (
    <div className={classes["smart-search"]}>
      <input
        type="search"
        placeholder="بحث"
        className={classes["smart-search__input"]}
        onChange={search}
        value={searchValue}
        onFocus={() => setShowSmartSearch(true)}
      />
      {showSmartSearch && (
        <ul className={classes["smart-search__result"]}>
          {filteredStockData.map((product: StockDoc) => {
            return (
              <li
                key={product.id}
                className={classes["smart-search__result-item"]}
                onClick={selectSearchResult.bind(null, product)}
              >
                {product.productName}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SmartSearch;
