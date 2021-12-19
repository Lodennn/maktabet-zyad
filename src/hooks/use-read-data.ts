import { useState } from "react";
import { DatabaseCollectionsType } from "../types/database";

const useReadData = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [readData, setReadData] = useState<DatabaseCollectionsType>();

  const triggerModalAction = (data?: any, event?: React.MouseEvent): void => {
    setReadData(data);
    setShowModal(true);
  };

  const hideModalAction = (event: React.MouseEvent): void => {
    setShowModal(false);
  };

  return {
    showModal,
    triggerModalAction,
    hideModal: hideModalAction,
    readData,
  };
};

export default useReadData;
