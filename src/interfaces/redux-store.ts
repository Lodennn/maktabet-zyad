import { BillsDoc, HttpInitialState, StockDoc } from ".";

export interface StockInitialState extends HttpInitialState<StockDoc> {
  filteredStockData: StockDoc[];
}

export interface BillsInitialState extends HttpInitialState<BillsDoc> {
  billSelectedProducts: StockDoc[];
  total: number;
}
