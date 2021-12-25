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
  // updatedBillProducts.forEach((billProduct: any) => {
  //   const updatedProduct = { ...billProduct };
  //   updatedProduct.totalProductAmount = 0;
  //   //prettier-ignore
  //   const index = updatedBillProducts.findIndex((updatedBillProduct) => updatedBillProduct.id === billProduct.id);
  //   updatedBillProducts[index] = updatedProduct;
  // });
};
