import { HttpInitialState, StockDoc } from ".";

export interface StockInitialState extends HttpInitialState<StockDoc> {
  filteredStockData: StockDoc[];
}
