import moment from "moment";
import { Fragment, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import SnackBar from "./components/Snackbar/Snackbar";
import { useAppDispatch } from "./hooks/use-app-dispatch";
import { useAppSelector } from "./hooks/use-app-selector";
import BillsPage from "./pages/BillsPage/BillsPage";
import HomePage from "./pages/HomePage/HomePage";
import MissingProductsPage from "./pages/MissingProductsPage/MissingProductsPage";
import PurchasesPage from "./pages/PurchasesPage/PurchasesPage";
import ReportsPage from "./pages/ReportsPage/ReportsPage";
import ReturnedBillsPage from "./pages/ReturnedBills/ReturnedBills";
import StockPage from "./pages/StockPage/StockPage";
import StorePage from "./pages/StorePage/StorePage";
import { addBillsData } from "./store/bills/bill-slice";
import { addMissingProductsDataToStore } from "./store/missing-products/missing-products-slice";
import { addOutlays } from "./store/outlays/outlays-slice";
import { addPurchasesDataToStore } from "./store/purchases/purchases-slice";
import { addReports } from "./store/reports/reports-slice";
import { addStockDataToStore } from "./store/stock/stock-slice";

function App() {
  moment.locale("ar");
  const dispatch = useAppDispatch();

  const { type, message } = useAppSelector((state) => state.snackbar);

  useEffect(() => {
    dispatch(addBillsData());
    dispatch(addStockDataToStore());
    dispatch(addMissingProductsDataToStore());
    dispatch(addPurchasesDataToStore());
    dispatch(addOutlays());
    dispatch(addReports());
  }, [dispatch]);

  return (
    <Fragment>
      <SnackBar type={type} message={message} />
      <Routes>
        <Route path="/stock" element={<StockPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/returned-bills" element={<ReturnedBillsPage />} />
        <Route path="/missing-products" element={<MissingProductsPage />} />
        <Route path="/report/:id" element={<ReportsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<h1>404 Page</h1>} />
      </Routes>
    </Fragment>
  );
}

export default App;
