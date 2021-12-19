import {
  StockDoc,
  MissingProductsDoc,
  PurchasesDoc,
  BillsDoc,
} from "../interfaces";

export type DatabaseCollectionsType =
  | StockDoc
  | MissingProductsDoc
  | PurchasesDoc
  | BillsDoc;
