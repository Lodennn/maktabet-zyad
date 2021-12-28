import React from "react";
import { formatNumber } from "../../../../helpers/functions";
import { StockDoc } from "../../../../interfaces";

const StockTableData: React.FC<{ dataItem: StockDoc; admin?: boolean }> = (
  props
) => {
  return (
    <tr key={props.dataItem.id}>
      <td>{props.dataItem.productName}</td>
      <td>{props.dataItem.category}</td>
      <td>{formatNumber(props.dataItem.remainingAmountOfPieces, "d")}</td>
      <td>{formatNumber(props.dataItem.priceOfPiece)}</td>
      <td>{formatNumber(props.dataItem.profitOfPiece)}</td>
      <td>{formatNumber(props.dataItem.numberOfUnits, "d")}</td>
      <td>{formatNumber(props.dataItem.priceOfUnit)}</td>
      <td>{formatNumber(props.dataItem.purchasingCosts)}</td>
      <td>{formatNumber(props.dataItem.profitPercent, "p")}</td>
      <td>{formatNumber(props.dataItem.totalProfit)}</td>
      {props.admin && (
        <td className="table__actions">
          <button className="btn btn--warning ml-xs">تعديل</button>
          <button className="btn btn--danger">مسح</button>
        </td>
      )}
    </tr>
  );
};

export default StockTableData;
