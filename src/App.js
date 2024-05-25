import "./css/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/Login";
import LandingPage from "./page/LandingPage";
import Dashboard from "./page/Dashboard";
import Product from "./page/Product";
import Layout from "./layouts/layout";
import ScrollToTop from "./utils/ScrollToTop";
import { ToastContainer } from "react-toastify";

function App() {
  const ROLE_SHOP = "ROLE_SHOP"
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER"
  const ROLE_AID_CENTER = "ROLE_AID_CENTER"
  const ROLE_ADMIN = "ROLE_ADMIN"

  const shopRoute = ({ element }) => {
    const roleShop = sessionStorage.getItem("role").replace(/"/g, "")

    if (roleShop === ROLE_SHOP) {
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
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="product" element={<Product />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
