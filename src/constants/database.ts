export enum COLLECTIONS {
  STOCK = "stock",
  MISSING_PRODUCTS = "missingProducts",
  PURCHASES = "purchases",
}

export enum DBTables {
  STOCK_TABLE = "البضاعه",
  MISSING_PRODUCTS_TABLE = "المنقوصات",
  PURCHASES_TABLE = "المشتريات",
  BILLS_TABLE = "الفواتير",
}

export enum TableFields {
  MERCHANT_NAME = "اسم التاجر",
  PRODUCT_NAME = "اسم الصنف",
  PRODUCT_CATEGORY = "نوع الصنف",
  PRODUCT_AMOUNT = "عدد القطع",
  PRICE_PIECE = "ثمن القطعه (جمله)",
  PROFIT_OF_PIECE = "الربح من القطعه",
  NUMBER_OF_UNITS_IN_PIECE = "عدد الوحده في القطعه",
  PRICE_OF_UNIT = "سعر الوحده",
  PURCHASING_COSTS = "ثمن الشراء",
  PERCENTAGE_OF_PROFIT = "نسبة الربح",
  TOTAL_PROFIT = "الربح الكلي",
  DATE = "التاريخ",
}
