import React from "react";
import { MissingProductsDoc } from "../../../../interfaces";

const MissingProductsTableData: React.FC<{
  dataItem: MissingProductsDoc;
  admin?: boolean;
}> = (props) => {
  return (
    <tr key={props.dataItem.id}>
      <td>{props.dataItem.productName}</td>
      <td>{props.dataItem.category}</td>
      <td>{props.dataItem.priceOfPiece}</td>
      <td>{props.dataItem.createdAt}</td>
      {props.admin && (
        <td className="table__actions">
          <button className="btn btn--warning ml-xs">تعديل</button>
          <button className="btn btn--danger">مسح</button>
        </td>
      )}
    </tr>
  );
};

export default MissingProductsTableData;
