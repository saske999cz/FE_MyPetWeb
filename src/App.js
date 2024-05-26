import "./css/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/Login";
import LandingPage from "./page/LandingPage";
import Dashboard from "./page/Dashboard";
import Layout from "./layouts/layout";
import ScrollToTop from "./utils/ScrollToTop";
import { ToastContainer } from "react-toastify";
import ProductList from "./page/product/ProductList/ProductList";
import ProductDetail from "./page/product/ProductDetail/ProductDetail";
import ProductUpdate from "./page/product/ProductUpdate/ProductUpdate";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="product-list" element={<ProductList />} />  
            <Route path="product-view" element={<ProductDetail />} />  
            <Route path="product-update" element={<ProductUpdate />} />  
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
