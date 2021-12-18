export interface StockDoc {
  id: string;
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
}
export interface PurchasesDoc {
  id: string;
  merchantName: string;
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
  createdAt: string;
}

export interface MissingProductsDoc {
  id: string;
  productName: string;
  category: string;
  priceOfUnit: number;
  profitPercent: number;
  createdAt: string;
}
