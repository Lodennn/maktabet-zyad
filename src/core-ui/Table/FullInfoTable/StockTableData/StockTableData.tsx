import React from "react";
import { StockDoc } from "../../../../interfaces";

const StockTableData: React.FC<{ dataItem: StockDoc; admin?: boolean }> = (
  props
) => {
  return (
    <tr key={props.dataItem.id}>
      <td>{props.dataItem.productName}</td>
      <td>{props.dataItem.category}</td>
      <td>{props.dataItem.numberOfPieces}</td>
      <td>{props.dataItem.priceOfPiece}</td>
      <td>{props.dataItem.profitOfPiece}</td>
      <td>{props.dataItem.numberOfUnits}</td>
      <td>{props.dataItem.priceOfUnit}</td>
      <td>{props.dataItem.purchasingCosts}</td>
      <td>{props.dataItem.profitPercent}%</td>
      <td>{props.dataItem.totalProfit}</td>
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
