import React, { useState } from "react";
import { StockDoc } from "../../interfaces";
import classes from "./SmartSearch.module.scss";

const SmartSearch: React.FC<{ data: any[] }> = (props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSmartSearch, setShowSmartSearch] = useState<boolean>(false);

  const search = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    setSearchValue(target.value);
    if (target.value === "") {
      setShowSmartSearch(false);
      return;
    }
    setShowSmartSearch(true);
  };
  const selectSearchResult = (
    searchResult: string,
    event: React.MouseEvent<HTMLLIElement>
  ): void => {
    setSearchValue(searchResult);
    setShowSmartSearch(false);
  };

  return (
    <div className={classes["smart-search"]}>
      <input
        type="search"
        placeholder="بحث"
        className={classes["smart-search__input"]}
        onChange={search}
        value={searchValue}
      />
      {showSmartSearch && (
        <ul className={classes["smart-search__result"]}>
          {props.data.map((product: StockDoc) => {
            return (
              <li
                key={product.id}
                className={classes["smart-search__result-item"]}
                onClick={selectSearchResult.bind(null, product.productName)}
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
