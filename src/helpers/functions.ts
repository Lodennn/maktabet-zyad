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
