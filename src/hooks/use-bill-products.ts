import { useReducer, useState } from "react";
import { StockDoc } from "../interfaces";

interface BillProductsInterface {
  billProducts: StockDoc[];
  total: number;
  amount: number;
  searchValue: StockDoc;
  removeProduct: StockDoc;
  piecePrice: number;
}

const initialState: BillProductsInterface = {
  billProducts: [],
  total: 0,
  amount: 1,
  searchValue: {} as StockDoc,
  removeProduct: {} as StockDoc,
  piecePrice: 0,
};

const reducerFn = (
  state: BillProductsInterface = initialState,
  action: any
) => {
  if (action.type === "GET_SEARCH_VALUE") {
    const searchedProductIndex = state.billProducts.findIndex(
      (searchedProduct) =>
        searchedProduct.id === action.payload.selectedProduct.id
    );

    let updatedBillProducts: StockDoc[] = [];

    if (searchedProductIndex >= 0) {
      updatedBillProducts = [...state.billProducts];
      state.billProducts[searchedProductIndex].totalProductAmount =
        action.payload.selectedProduct.totalProductAmount;
    } else {
      updatedBillProducts = state.billProducts.concat(
        action.payload.selectedProduct
      );
    }
    const searchedProductAmount: number = updatedBillProducts.reduce(
      (acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      },
      0
    );

    return {
      ...state,
      billProducts: updatedBillProducts,
      searchValue: action.payload.selectedProduct,
      total: searchedProductAmount,
    };
  }
  if (action.type === "CHANGE_PRODUCT_AMOUNT") {
    //prettier-ignore
    const searchedProductWithAmount = {
      ...action.payload.searchedProduct,
      totalProductAmount: action.payload.value,
    };
    return {
      ...state,
      searchValue: searchedProductWithAmount,
      amount: action.payload.value,
    };
  }
  if (action.type === "CHANGE_PIECE_PRICE") {
    return {
      ...state,
      piecePrice: action.payload.value,
    };
  }
  if (action.type === "REMOVE_PRODUCT") {
    const filteredBillProducts = state.billProducts.filter(
      (billProduct) => billProduct.id !== action.payload.selectedProduct.id
    );

    const searchedProductAmount: number = filteredBillProducts.reduce(
      (acc, cur) => {
        return acc + cur.priceOfPiece * cur.totalProductAmount!;
      },
      0
    );
    return {
      ...state,
      billProducts: filteredBillProducts,
      amount: searchedProductAmount,
    };
  }
  return state;
};

const useBillProducts = () => {
  const [counter, setCounter] = useState<number>(0);

  const [productFormArray, setProductFormArray] = useState<number[]>([counter]);

  function addProductFormData(event: React.MouseEvent<HTMLButtonElement>) {
    setCounter((prevState) => prevState + 1);
    setProductFormArray((prevState) => prevState.concat(counter + 1));
  }

  function removeProductFormData(productIndex: number) {
    setProductFormArray((prevState) =>
      prevState.filter((productId) => {
        return productId !== productIndex;
      })
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  const [billProductsData, dispatch] = useReducer(reducerFn, initialState);

  const getSearchValue = (searchedProduct: StockDoc) => {
    //prettier-ignore
    const searchedProductWithAmount = {
      ...searchedProduct,
      totalProductAmount: billProductsData.amount,
    };
    dispatch({
      type: "GET_SEARCH_VALUE",
      payload: { selectedProduct: searchedProductWithAmount },
    });

    // const searchedProductWithAmount = {
    //   ...searchedProduct,
    //   totalProductAmount: searchedProductAmount,
    // };

    // dispatch(
    //   purchasesActions.addProductToBill({
    //     selectedProduct: searchedProductWithAmount,
    //   })
    // );
  };

  const onChangeProductAmountHandler = (
    changedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    dispatch({
      type: "CHANGE_PRODUCT_AMOUNT",
      payload: { value: targetValue, searchedProduct: changedProduct },
    });
    const searchedProductWithAmount = {
      ...changedProduct,
      totalProductAmount: targetValue,
    };
    dispatch({
      type: "GET_SEARCH_VALUE",
      payload: { selectedProduct: searchedProductWithAmount },
    });

    // const searchedProductWithAmount = {
    //   ...searchedProduct,
    //   totalProductAmount: +target.value,
    // };

    // dispatch(
    //   purchasesActions.addProductToBill({
    //     selectedProduct: searchedProductWithAmount,
    //   })
    // );
  };

  const onChangePiecePriceHandler = (
    changedProduct: StockDoc,
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = event.target as HTMLInputElement;
    const targetValue = +target.value;

    dispatch({ type: "CHANGE_PIECE_PRICE", payload: { value: targetValue } });

    // const searchedProductData = {
    //   ...searchedProduct,
    //   priceOfPiece: targetValue,
    //   totalProductAmount: searchedProductAmount,
    // };

    // dispatch(
    //   purchasesActions.updateBillProducts({
    //     selectedProduct: searchedProductData,
    //   })
    // );
  };

  const removeProductFromBill = (
    removeProduct: StockDoc,
    productIndex: number
  ) => {
    removeProductFormData(productIndex);

    // const searchedProductWithAmount = {
    //   ...searchedProduct,
    //   totalProductAmount: searchedProductAmount,
    // };

    //prettier-ignore
    dispatch({type: "REMOVE_PRODUCT", payload: { selectedProduct: removeProduct }});

    // dispatch(
    //   purchasesActions.removeProductFromBill({
    //     selectedProduct: searchedProductWithAmount,
    //   })
    // );
  };

  return {
    ...billProductsData,
    productFormArray,
    addProductFormData,
    removeProductFormData,
    getSearchValue,
    onChangeProductAmountHandler,
    onChangePiecePriceHandler,
    removeProductFromBill,
  };
};

export default useBillProducts;
