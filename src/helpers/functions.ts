import { StockDoc } from "../interfaces";

export const trimStockProductsData = (productsArray: StockDoc[]) => {
  productsArray.forEach((product: StockDoc) => {
    delete product.totalProductAmount;
  });
};
