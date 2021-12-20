import React from "react";
import { PurchasesDoc, StockDoc } from "../../../../interfaces";

const PurchasesTableData: React.FC<{
  product: StockDoc & PurchasesDoc;
  admin?: boolean;
}> = (props) => {
  console.log("PurchasesTable: ", props.product);
  return (
    <tr key={props.product.id}>
      <td>{props.product.productName}</td>
      <td>{props.product.category}</td>
      <td>{props.product.numberOfPieces}</td>
      <td>{props.product.priceOfPiece}</td>
      <td>{props.product.profitOfPiece}</td>
      <td>{props.product.numberOfUnits}</td>
      <td>{props.product.priceOfUnit}</td>
      <td>{props.product.purchasingCosts}</td>
      <td>{props.product.profitPercent}%</td>
      <td>{props.product.totalProfit}</td>

      {props.admin && (
        <td className="table__actions">
          <button className="btn btn--warning ml-xs">تعديل</button>
          <button className="btn btn--danger">مسح</button>
        </td>
      )}
    </tr>
  );
};

export default PurchasesTableData;
