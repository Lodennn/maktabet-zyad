import { StockDoc, MissingProductsDoc, PurchasesDoc } from "../interfaces";

export type DatabaseCollectionsType =
  | StockDoc
  | MissingProductsDoc
  | PurchasesDoc;
