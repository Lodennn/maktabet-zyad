import { Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { BillType } from "../types/bills";

export interface StockDoc {
  id?: string;
  productName: string;
  category: string;
  numberOfPieces: number;
  priceOfPiece: number;
  numberOfUnits: number;
  priceOfUnit: number;
  purchasingCosts: number;
  profitOfPiece: number;
  totalProfit: number;
  profitPercent: number;
  totalProductAmount?: number;
  oldProductAmount?: number;
  totalNumberOfUnits: number;
  remainingAmountOfPieces: number;
  remainingAmountOfUnits: number;
  updatedProductAmount?: number;
}

export interface BillsDoc {
  id?: string;
  products: StockDoc[];
  type: BillType;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PurchasesDoc {
  id?: string;
  merchantName?: string;
  products: StockDoc[];
  type: BillType;
  total: number;
  createdAt: string;
}

export interface MissingProductsDoc {
  id?: string;
  productName: string;
  category: string;
  priceOfUnit: number;
  profitPercent: number;
  createdAt: string;
}

export interface DatabaseCollectionsType
  extends StockDoc,
    PurchasesDoc,
    MissingProductsDoc,
    BillsDoc {}

export interface SendRequestData {
  collectionName: COLLECTIONS;
  data: DatabaseCollectionsType;
}

export interface UpdateRequestData {
  collectionName: COLLECTIONS;
  docId: any;
  newData: any;
}

export interface DeleteRequestData {
  collectionName: COLLECTIONS;
  docId: string;
}
