import React from "react";
import { formatNumber } from "../../../../helpers/functions";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import { StockDoc } from "../../../../interfaces";
import { deleteStockDataFromStore } from "../../../../store/stock/stock-slice";

const StockTableData: React.FC<{
  dataItem: StockDoc;
  admin?: boolean;
  updateStockTrigger: (
    data: any,
    event?: React.MouseEvent<Element, MouseEvent> | undefined
  ) => void;
}> = (props) => {
  const dispatch = useAppDispatch();

  const onUpdateStockProduct = (
    stockProduct: StockDoc,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    props.updateStockTrigger(stockProduct);
  };

  const onDeleteStockProduct = (
    stockProduct: StockDoc,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(deleteStockDataFromStore(stockProduct));
  };
  return (
    <tr key={props.dataItem.id}>
      <td>{props.dataItem.productName}</td>
      <td>{props.dataItem.category}</td>
      <td>{formatNumber(props.dataItem.remainingAmountOfPieces, "d")}</td>
      <td>{formatNumber(props.dataItem.priceOfPiece)}</td>
      <td>{formatNumber(props.dataItem.profitOfPiece)}</td>
      <td>{formatNumber(props.dataItem.numberOfUnits, "d")}</td>
      <td>{formatNumber(props.dataItem.priceOfUnit)}</td>
      <td>{formatNumber(props.dataItem.profitOfUnit, "d")}</td>
      <td>{formatNumber(props.dataItem.profitPercent, "p")}</td>
      <td>{formatNumber(props.dataItem.totalProfit, "d")}</td>
      {props.admin && (
        <td className="table__actions">
          <button
            className="btn btn--warning ml-xs"
            onClick={onUpdateStockProduct.bind(null, props.dataItem)}
          >
            تعديل
          </button>
          <button
            className="btn btn--danger"
            onClick={onDeleteStockProduct.bind(null, props.dataItem)}
          >
            مسح
          </button>
        </td>
      )}
    </tr>
  );
};

export default StockTableData;
