import React from "react";
import { Outlet } from "react-router-dom";
import { formatFullDate } from "../../../../helpers/functions";
import { useAppDispatch } from "../../../../hooks/use-app-dispatch";
import { OutlaysDoc } from "../../../../interfaces";
import {
  deleteOutlayAction,
  updateOutlayAction,
} from "../../../../store/outlays/outlays-slice";

const OutlaysTableData: React.FC<{
  dataItem: OutlaysDoc;
  admin?: boolean;
  onUpdate: (
    outlay: OutlaysDoc,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void;
}> = (props) => {
  const dispatch = useAppDispatch();

  const onUpdateOutlay = (
    outlay: OutlaysDoc,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    props.onUpdate(outlay);
  };

  const onDeleteOutlay = (
    outlay: OutlaysDoc,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(deleteOutlayAction(outlay));
  };
  return (
    <tr key={props.dataItem.id}>
      <td>{props.dataItem.title}</td>
      <td>{props.dataItem.amount}</td>
      <td>{formatFullDate(props.dataItem.createdAt)}</td>
      {props.admin && (
        <td className="table__actions">
          <button
            className="btn btn--warning ml-xs"
            onClick={onUpdateOutlay.bind(null, props.dataItem)}
          >
            تعديل
          </button>
          <button
            className="btn btn--danger"
            onClick={onDeleteOutlay.bind(null, props.dataItem)}
          >
            مسح
          </button>
        </td>
      )}
    </tr>
  );
};

export default OutlaysTableData;
