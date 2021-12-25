import moment from "moment";
import { StockDoc } from "../interfaces";

// export const trimStockProductsData = (productsArray: StockDoc[]) => {
//   productsArray.forEach((product: StockDoc) => {
//     delete product.totalProductAmount;
//   });
// };

export const trimBillDataBeforeAction = (productsArray: any[]) => {
  productsArray.forEach((product: any) => {
    delete product.oldProductAmount;
    delete product.updatedProductAmount;
  });
};

export const changeBillProductsTotalAmount = (billProducts: any[]) => {
  billProducts.forEach((billProduct: any) => {
    billProduct.totalProductAmount = billProduct.updatedProductAmount;
  });
};

export const resetBillProductsTotalAmount = (billProducts: any[]) => {
  const updatedBillProducts = [...billProducts];
  return updatedBillProducts.map((billProduct: any) => {
    return { ...billProduct, totalProductAmount: 0 };
  });
};

export const formatDate = (date: string) => {
  return moment(new Date(date)).startOf("hour").fromNow();
};

export const maxDate = () => {
  const now: Date = new Date();
  let day: string | number = now.getDate();
  let month: string | number = now.getMonth() + 1;
  const year: number = now.getFullYear();

  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

export const dateMe = (date: string) => new Date(date);

export const resetDate = (date: Date) => date.setHours(0, 0, 0, 0);
