import { useState } from "react";

interface readDataInterface {
  id: number;
  products: any[];
  price: number;
  createdAt: string;
}

const useReadData = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [readData, setReadData] = useState<readDataInterface>();

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
