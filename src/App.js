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
import Unauthorized from "./page/unauthorized/Unauthorized";
import NotFound from "./page/notFound/NotFound";
import InvoiceList from "./page/invoice/InvoiceList/InvoiceList";
import InvoiceDetail from "./page/invoice/InvoiceDetail/InvoiceDetail";

function App() {
  const ROLE_SHOP = "ROLE_SHOP"
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER"
  const ROLE_AID_CENTER = "ROLE_AID_CENTER"
  const ROLE_ADMIN = "ROLE_ADMIN"

  const ShopRoute = ({ element }) => {
    // const roleShop = localStorage.getItem("role").replace(/"/g, "")

    // if (roleShop === ROLE_SHOP) {
    //   return element
    // } else {
    //   return <Navigate to="/unauthorized" replace />
    // }
    return element
  }

  const MedicalCenterRoute = ({ element }) => {
    const roleMedicalCenter = localStorage.getItem("role").replace(/"/g, "")

    if (roleMedicalCenter === ROLE_MEDICAL_CENTER) {
      return element
    } else {
      return <Navigate to="/unauthorized" replace />
    }
  }

  const AidCenterRoute = ({ element }) => {
    const roleAidCenter = localStorage.getItem("role").replace(/"/g, "")

    if (roleAidCenter === ROLE_AID_CENTER) {
      return element
    } else {
      return <Navigate to="/unauthorized" replace />
    }
  }

  const AdminRoute = ({ element }) => {
    const roleAdmin = localStorage.getItem("role").replace(/"/g, "")

    if (roleAdmin === ROLE_ADMIN) {
      return element
    } else {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* shop routes */}
          <Route path="/dashboard" element={<ShopRoute element={<Layout />} />}>
            <Route index element={<Dashboard />} />
            <Route path="product-list" element={<ProductList />} />  
            <Route path="product-view" element={<ProductDetail />} />  
            <Route path="product-update" element={<ProductUpdate />} />  
            <Route path="invoice-list" element={<InvoiceList />} />  
            <Route path="invoice-view" element={<InvoiceDetail />} />  
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Not Found Page */}
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
