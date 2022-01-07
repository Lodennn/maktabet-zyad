import { createSlice } from "@reduxjs/toolkit";
import { COLLECTIONS } from "../../constants";
import {
  BillsDoc,
  DeleteRequestData,
  MissingProductsDoc,
  StockDoc,
} from "../../interfaces";
import { StockInitialState } from "../../interfaces/redux-store";
import { deleteData, readData, sendData, updateData } from "../../services/api";
import { AppDispatch } from "../index";
import {
  deleteMissingProduct,
  insertMissingProduct,
} from "../missing-products/missing-products-slice";

const initialState: StockInitialState = {
  isLoading: false,
  error: null,
  data: [],
  productsInStore: [],
  filteredStockData: [],
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    fetchingStockData(state, action) {
      state.isLoading = true;
    },
    errorStockData(state, action) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    addStockData(state, action) {
      state.data = action.payload.data;
      state.filteredStockData = action.payload.data.filter(
        (product: StockDoc) => product.totalNumberOfUnits > 0
      );
      state.productsInStore = action.payload.data.filter(
        (product: StockDoc) => product.totalNumberOfUnits > 0
      );
      state.isLoading = false;
      state.error = null;
    },
    filterStockData(state, action) {
      let tempStockData = [...state.data];
      tempStockData = tempStockData.filter(
        (data) =>
          data.productName.includes(action.payload.searchValue) &&
          data.totalNumberOfUnits > 0
      );
      state.filteredStockData = tempStockData;
    },
    updateStockProductsFromBill(state, action) {
      action.payload.updatedStockProducts.forEach((billProduct: StockDoc) => {
        //prettier-ignore
        const stockProductIndex = state.data.findIndex((stockProduct: StockDoc) => stockProduct.productName === billProduct.productName);
        if (stockProductIndex >= 0) {
          state.data[stockProductIndex] = billProduct;
        }
      });
    },
    updateStockProduct(state, action) {
      const updatedProductIndex = state.data.findIndex(
        (stockProduct: StockDoc) => stockProduct.id === action.payload.data.id
      );
      state.data[updatedProductIndex] = action.payload.data;
    },
    deleteStockProduct(state, action) {
      state.data = state.data.filter(
        (stockProduct: StockDoc) => stockProduct.id !== action.payload.data.id
      );
    },
  },
});

export const stockActions = stockSlice.actions;

const isProductInStock = (productIndex: number) => productIndex >= 0;

export const addPurchaseBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;
      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );
      if (isProductInStock(stockProductInBillIndex)) {
        updatedProduct = { ...stockData[stockProductInBillIndex] };
        dispatch(addPurchaseBillOfExistingProduct(updatedProduct, billProduct));
      } else {
        dispatch(addPurchaseBillOfNotExistingProduct(billData, billProduct));
      }
    });
  };
export const addPurchaseBillOfExistingProduct =
  (updatedProduct: StockDoc, billProductInStock: StockDoc) =>
  (dispatch: AppDispatch) => {
    const missingProduct: MissingProductsDoc = {
      productName: updatedProduct.productName,
      createdAt: new Date().toString(),
      category: updatedProduct.category,
      priceOfPiece: updatedProduct.priceOfPiece,
    };

    updatedProduct.numberOfUnits = billProductInStock.numberOfUnits;
    updatedProduct.priceOfPiece = billProductInStock.priceOfPiece;
    updatedProduct.priceOfUnit = billProductInStock.priceOfUnit;
    //prettier-ignore
    updatedProduct.totalNumberOfUnits += billProductInStock.totalProductAmount! * billProductInStock.numberOfUnits;
    dispatch(deleteMissingProduct(missingProduct));
    // UPDATE STOCK WHEN THE PRODUCT IS FOUND
    //prettier-ignore
    updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
    //prettier-ignore
    updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;
    updateData({
      collectionName: COLLECTIONS.STOCK,
      docId: updatedProduct.id,
      newData: updatedProduct,
    });
  };

export const addPurchaseBillOfNotExistingProduct =
  (billData: BillsDoc, billProduct: any) => (dispatch: AppDispatch) => {
    // ADD NEW ITEM TO STOCK WHEN THE PRODUCT IS NOT FOUND

    const { priceOfPiece, priceOfUnit, numberOfUnits, totalProductAmount } =
      billProduct;
    //

    let profitOfUnitEquation, totalProfitEquation, profitPercentEquation;

    const newProduct: StockDoc = {
      ...billProduct,
      numberOfPieces: totalProductAmount,
      purchasingCosts: billData.total,
      remainingAmountOfPieces: totalProductAmount,
      remainingAmountOfUnits: 0,
      totalNumberOfUnits: totalProductAmount * numberOfUnits,
      totalProductAmount: 1,
    };
    //prettier-ignore
    const profit = (numberOfUnits * priceOfUnit) - priceOfPiece;
    profitOfUnitEquation = profit / numberOfUnits;
    //prettier-ignore
    totalProfitEquation = (profit / priceOfPiece) * ((newProduct.totalNumberOfUnits / newProduct.numberOfUnits) * priceOfPiece);
    //prettier-ignore
    profitPercentEquation = (profit / priceOfPiece) * 100;

    newProduct.profitOfPiece = profit;
    newProduct.profitOfUnit = +profitOfUnitEquation.toFixed(2);
    newProduct.totalProfit = totalProfitEquation;
    newProduct.profitPercent = profitPercentEquation;
    // ADD TO STOCK
    sendData({
      collectionName: COLLECTIONS.STOCK,
      data: newProduct,
    });
  };

export const updatePurchaseBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;
      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );
      updatedProduct = { ...stockData[stockProductInBillIndex] };
      if (!!billProduct.oldProductAmount) {
        const { priceOfPiece, priceOfUnit, numberOfUnits } = billProduct;

        let profitOfUnitEquation, totalProfitEquation, profitPercentEquation;
        //
        const newProduct: StockDoc = {
          ...updatedProduct,
        };

        //prettier-ignore
        if((billProduct.totalProductAmount*billProduct.numberOfUnits) > billProduct.oldProductAmount) {
          newProduct.numberOfPieces += billProduct.totalProductAmount;
          //prettier-ignore
          newProduct.totalNumberOfUnits = (updatedProduct.totalNumberOfUnits - billProduct.oldProductAmount) + (billProduct.totalProductAmount * billProduct.numberOfUnits)
        }

        //prettier-ignore
        if((billProduct.totalProductAmount*billProduct.numberOfUnits) < billProduct.oldProductAmount) {
          newProduct.numberOfPieces -= billProduct.totalProductAmount;
          //prettier-ignore
          newProduct.totalNumberOfUnits = (updatedProduct.totalNumberOfUnits - billProduct.oldProductAmount) + (billProduct.totalProductAmount * billProduct.numberOfUnits)
        }

        if (billProduct.category !== updatedProduct.category) {
          newProduct.category = billProduct.category;
        }

        //prettier-ignore
        if(billProduct.priceOfPiece !== updatedProduct.priceOfPiece) {
            newProduct.priceOfPiece = billProduct.priceOfPiece;
          }
        //prettier-ignore
        if(billProduct.numberOfUnits !== updatedProduct.numberOfUnits) {
            newProduct.numberOfUnits = billProduct.numberOfUnits;
          }
        //prettier-ignore
        if(billProduct.priceOfUnit !== updatedProduct.priceOfUnit) {
            newProduct.priceOfUnit = billProduct.priceOfUnit;
          }
        //prettier-ignore
        newProduct.remainingAmountOfPieces = Math.abs(newProduct.totalNumberOfUnits / newProduct.numberOfUnits);
        //prettier-ignore
        newProduct.remainingAmountOfUnits = Math.abs(newProduct.totalNumberOfUnits % newProduct.numberOfUnits);

        //prettier-ignore
        const profit = (numberOfUnits * priceOfUnit) - priceOfPiece;
        profitOfUnitEquation = profit / numberOfUnits;
        //prettier-ignore
        totalProfitEquation = (profit / priceOfPiece) * ((newProduct.totalNumberOfUnits / newProduct.numberOfUnits) * priceOfPiece);
        //prettier-ignore
        profitPercentEquation = (profit / priceOfPiece) * 100;

        newProduct.profitOfPiece = profit;
        newProduct.profitOfUnit = +profitOfUnitEquation.toFixed(2);
        newProduct.totalProfit = totalProfitEquation;
        newProduct.profitPercent = profitPercentEquation;

        updatedProduct = newProduct;
      }
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const deletePurchaseBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const isProductFreshInStock =
        billProduct.totalProductAmount * billProduct.numberOfUnits ===
        updatedProduct.totalNumberOfUnits;

      if (isProductFreshInStock) {
        deleteData({
          collectionName: COLLECTIONS.STOCK,
          docId: updatedProduct.id!,
        });
      } else {
        updatedProduct.totalNumberOfUnits -=
          billProduct.totalProductAmount * billProduct.numberOfUnits;
        //prettier-ignore
        updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
        //prettier-ignore
        updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

        // UPDATE STOCK WHEN THE PRODUCT IS FOUND
        updateData({
          collectionName: COLLECTIONS.STOCK,
          docId: updatedProduct.id,
          newData: updatedProduct,
        });
      }
    });
  };

export const addNormalBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const missingProduct: MissingProductsDoc = {
        productName: updatedProduct.productName,
        createdAt: new Date().toString(),
        category: updatedProduct.category,
        priceOfPiece: updatedProduct.priceOfPiece,
      };

      updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;

      if (updatedProduct.totalNumberOfUnits <= 0) {
        //prettier-ignore
        dispatch(insertMissingProduct(missingProduct));
      }

      //prettier-ignore
      updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
      //prettier-ignore
      updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

      // UPDATE STOCK WHEN THE PRODUCT IS FOUND
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const updateNormalBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const missingProduct: MissingProductsDoc = {
        productName: updatedProduct.productName,
        createdAt: new Date().toString(),
        category: updatedProduct.category,
        priceOfPiece: updatedProduct.priceOfPiece,
      };

      if (!!billProduct.oldProductAmount) {
        //prettier-ignore
        if (billProduct.totalProductAmount > billProduct.oldProductAmount) {
          //prettier-ignore
          updatedProduct.totalNumberOfUnits -= billProduct.initialProductAmount;
          if (updatedProduct.totalNumberOfUnits <= 0) {
            //prettier-ignore
            dispatch(insertMissingProduct(missingProduct));
          }
        } else {
          //prettier-ignore
          updatedProduct.totalNumberOfUnits += billProduct.initialProductAmount;      
          if (billProduct.totalProductAmount < billProduct.totalNumberOfUnits) {
            //prettier-ignore
            dispatch(deleteMissingProduct(missingProduct));
          }
        }
      }

      //prettier-ignore
      updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
      //prettier-ignore
      updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

      // UPDATE STOCK WHEN THE PRODUCT IS FOUND
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const deleteNormalBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const missingProduct: MissingProductsDoc = {
        productName: updatedProduct.productName,
        createdAt: new Date().toString(),
        category: updatedProduct.category,
        priceOfPiece: updatedProduct.priceOfPiece,
      };

      updatedProduct.totalNumberOfUnits += billProduct.totalProductAmount;
      dispatch(deleteMissingProduct(missingProduct));

      //prettier-ignore
      updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
      //prettier-ignore
      updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

      // UPDATE STOCK WHEN THE PRODUCT IS FOUND
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const addReturnedBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const missingProduct: MissingProductsDoc = {
        productName: updatedProduct.productName,
        createdAt: new Date().toString(),
        category: updatedProduct.category,
        priceOfPiece: updatedProduct.priceOfPiece,
      };

      updatedProduct.totalNumberOfUnits += billProduct.totalProductAmount;
      dispatch(deleteMissingProduct(missingProduct));

      //prettier-ignore
      updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
      //prettier-ignore
      updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

      // UPDATE STOCK WHEN THE PRODUCT IS FOUND
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const updateReturnedBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const missingProduct: MissingProductsDoc = {
        productName: updatedProduct.productName,
        createdAt: new Date().toString(),
        category: updatedProduct.category,
        priceOfPiece: updatedProduct.priceOfPiece,
      };

      if (!!billProduct.oldProductAmount) {
        //prettier-ignore
        if (billProduct.totalProductAmount > billProduct.oldProductAmount) {
          //prettier-ignore
          updatedProduct.totalNumberOfUnits += billProduct.initialProductAmount;
          if (billProduct.totalProductAmount < billProduct.totalNumberOfUnits) {
            //prettier-ignore
            dispatch(deleteMissingProduct(missingProduct));
          }
        } else {
          //prettier-ignore    
          updatedProduct.totalNumberOfUnits -= billProduct.initialProductAmount;      
          if (updatedProduct.totalNumberOfUnits <= 0) { 
            //prettier-ignore
            dispatch(insertMissingProduct(missingProduct));
          }
        }
      }

      //prettier-ignore
      updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
      //prettier-ignore
      updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

      // UPDATE STOCK WHEN THE PRODUCT IS FOUND
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const deleteReturnedBill =
  (billData: BillsDoc) => (dispatch: AppDispatch, getState: any) => {
    const stockData = [...getState().stock.data];
    billData.products.forEach((billProduct: any) => {
      let updatedProduct: StockDoc = {} as StockDoc;

      const stockProductInBillIndex = stockData.findIndex(
        (stockProduct: StockDoc) =>
          stockProduct.productName === billProduct.productName
      );

      updatedProduct = { ...stockData[stockProductInBillIndex] };

      const missingProduct: MissingProductsDoc = {
        productName: updatedProduct.productName,
        createdAt: new Date().toString(),
        category: updatedProduct.category,
        priceOfPiece: updatedProduct.priceOfPiece,
      };

      updatedProduct.totalNumberOfUnits -= billProduct.totalProductAmount;
      if (updatedProduct.totalNumberOfUnits <= 0) {
        //prettier-ignore
        dispatch(insertMissingProduct(missingProduct));
      }

      //prettier-ignore
      updatedProduct.remainingAmountOfPieces = Math.trunc(updatedProduct.totalNumberOfUnits / updatedProduct.numberOfUnits);
      //prettier-ignore
      updatedProduct.remainingAmountOfUnits = updatedProduct.totalNumberOfUnits % updatedProduct.numberOfUnits;

      // UPDATE STOCK WHEN THE PRODUCT IS FOUND
      updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: updatedProduct.id,
        newData: updatedProduct,
      });
    });
  };

export const addStockDataToStore = () => async (dispatch: AppDispatch) => {
  dispatch(stockActions.fetchingStockData({}));
  try {
    const stockData = await readData(COLLECTIONS.STOCK);
    dispatch(stockActions.addStockData({ data: stockData }));
  } catch (err) {
    dispatch(stockActions.errorStockData({}));
  }
};

export const updateStockDataToStore =
  (stockProduct: StockDoc) => async (dispatch: AppDispatch) => {
    try {
      await updateData({
        collectionName: COLLECTIONS.STOCK,
        docId: stockProduct.id,
        newData: stockProduct,
      }).then((_) => {
        dispatch(stockActions.updateStockProduct({ data: stockProduct }));
      });
    } catch (err) {
      console.error(err);
    }
  };

export const deleteStockDataFromStore =
  (stockProduct: StockDoc) => async (dispatch: AppDispatch) => {
    try {
      await deleteData({
        collectionName: COLLECTIONS.STOCK,
        docId: stockProduct.id,
      } as DeleteRequestData).then((_) => {
        dispatch(stockActions.deleteStockProduct({ data: stockProduct }));
      });
    } catch (err) {
      console.error(err);
    }
  };

export default stockSlice.reducer;
