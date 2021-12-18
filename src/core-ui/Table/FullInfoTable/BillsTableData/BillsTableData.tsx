import React from "react";
import { StockDoc } from "../../../../interfaces";

const BillsTableData: React.FC<{ dataItem: StockDoc; admin?: boolean }> = (
  props
) => {
  return (
    <tr key={props.dataItem.id}>
      <td>{props.dataItem.productName}</td>
      <td>{props.dataItem.category}</td>
      <td>{props.dataItem.priceOfUnit}</td>
      <td>5</td>
      {props.admin && (
        <td className="table__actions">
          <button className="btn btn--warning ml-xs">تعديل</button>
          <button className="btn btn--danger">مسح</button>
        </td>
      )}
    </tr>
  );
};

export default BillsTableData;
