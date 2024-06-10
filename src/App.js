import "./css/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import Dashboard from "./page/Dashboard";
import Layout from "./layouts/layout";
import ScrollToTop from "./utils/ScrollToTop";
import { ToastContainer } from "react-toastify";
import ProductList from "./page/shop/product/ProductList/ProductList";
import ProductDetail from "./page/shop/product/ProductDetail/ProductDetail";
import ProductUpdate from "./page/shop/product/ProductUpdate/ProductUpdate";
import Unauthorized from "./page/unauthorized/Unauthorized";
import NotFound from "./page/notFound/NotFound";
import InvoiceList from "./page/shop/invoice/InvoiceList/InvoiceList";
import InvoiceDetail from "./page/shop/invoice/InvoiceDetail/InvoiceDetail";
import Settings from "./page/settings/Settings";
import Login from "./page/login/Login";
import Register from "./page/register/Register";
import ForgotPassword from "./page/forgotPassword/ForgotPassword";
import "react-toastify/dist/ReactToastify.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import ProductCreate from "./page/shop/product/ProductCreate/ProductCreate";
import Profile from "./page/profile/Profile";

function App() {
  const ROLE_ADMIN = "ROLE_ADMIN"
  const ROLE_SHOP = "ROLE_SHOP"
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER"
  const ROLE_AID_CENTER = "ROLE_AID_CENTER"

  const AuthRoute = ({ children, roles }) => {
    const role = localStorage.getItem("role")?.replace(/"/g, "");

    return roles.includes(role) ? children : <Navigate to="/unauthorized" replace />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* auth routes */}
          <Route
            path="/dashboard"
            element={
              <AuthRoute roles={[ROLE_ADMIN, ROLE_SHOP, ROLE_MEDICAL_CENTER, ROLE_AID_CENTER]}>
                <Layout />
              </AuthRoute>}
          >
            <Route index element={<Dashboard />} />

            {/* Shop routes */}
            <Route
              path="product-list"
              element={<AuthRoute roles={[ROLE_SHOP]}><ProductList /></AuthRoute>}
            />
            <Route
              path="product-create"
              element={<AuthRoute roles={[ROLE_SHOP]}><ProductCreate /></AuthRoute>}
            />
            <Route
              path="product-view/:id"
              element={<AuthRoute roles={[ROLE_SHOP]}><ProductDetail /></AuthRoute>}
            />
            <Route
              path="product-update/:id"
              element={<AuthRoute roles={[ROLE_SHOP]}><ProductUpdate /></AuthRoute>}
            />
            <Route
              path="invoice-list"
              element={<AuthRoute roles={[ROLE_SHOP]}><InvoiceList /></AuthRoute>}
            />
            <Route
              path="invoice-view"
              element={<AuthRoute roles={[ROLE_SHOP]}><InvoiceDetail /></AuthRoute>}
            />
            <Route
              path="profile"
              element={<AuthRoute roles={[ROLE_SHOP]}><Profile /></AuthRoute>}
            />
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
