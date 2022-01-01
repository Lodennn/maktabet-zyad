import {
  BillsDoc,
  HttpInitialState,
  OutlaysDoc,
  PurchasesDoc,
  StockDoc,
} from ".";

export interface StockInitialState extends HttpInitialState<StockDoc> {
  filteredStockData: StockDoc[];
  productsInStore: StockDoc[];
}

export interface BillsInitialState extends HttpInitialState<BillsDoc> {
  billSelectedProducts: StockDoc[];
  dailyBills: BillsDoc[];
  dailyBillsTotal: number;
  total: number;
}

export interface PurchasesInitialState extends HttpInitialState<PurchasesDoc> {
  billSelectedProducts: StockDoc[];
  total: number;
}

export interface OutlaysInitialState extends HttpInitialState<OutlaysDoc> {
  dailtyOutlaysTotal: number;
}
