import { BillsDoc, HttpInitialState, PurchasesDoc, StockDoc } from ".";

export interface StockInitialState extends HttpInitialState<StockDoc> {
  filteredStockData: StockDoc[];
  productsInStore: StockDoc[];
}

export interface BillsInitialState extends HttpInitialState<BillsDoc> {
  billSelectedProducts: StockDoc[];
  dailyBills: BillsDoc[];
  total: number;
}

export interface PurchasesInitialState extends HttpInitialState<PurchasesDoc> {
  billSelectedProducts: StockDoc[];
  total: number;
}
