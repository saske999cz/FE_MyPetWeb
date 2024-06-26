import "./css/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./page/LandingPage";
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
import Login from "./page/login/Login";
import RegisterShop from "./page/register/RegisterShop";
import RegisterMedicalCenter from "./page/register/RegisterMedicalCenter";
import RegisterShelter from "./page/register/RegisterShelter";
import ForgotPassword from "./page/forgotPassword/ForgotPassword";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import ProductCreate from "./page/shop/product/ProductCreate/ProductCreate";
import Profile from "./page/profile/Profile";
import Dashboard from "./page/Dashboard";
import { useAuth } from "./utils/AuthContext";
import AdminShopList from "./page/admin/shop/ShopList/AdminShopList";
import AdminMedicalCenterList from "./page/admin/medicalCenter/MedicalCenterList/AdminMedicalCenterList";
import AdminAidCenterList from "./page/admin/aidCenter/AidCenterList/AdminAidCenterList";
import HelpSupport from "./page/HelpSupport";
import Settings from "./page/settings/Settings";
import AdminShopDetail from "./page/admin/shop/ShopDetail/AdminShopDetail";
import AdminMedicalCenterDetail from "./page/admin/medicalCenter/MedicalCenterDetail/AdminMedicalCenterDetail";
import AdminAidCenterDetail from "./page/admin/aidCenter/AidCenterDetail/AdminAidCenterDetail";
import PetList from "./page/aidCenter/pet/PetList/PetList";
import PetDetail from "./page/aidCenter/pet/PetDetail/PetDetail";
import PetCreate from "./page/aidCenter/pet/PetCreate/PetCreate";
import PetUpdate from "./page/aidCenter/pet/PetUpdate/PetUpdate";
import AdoptRequestList from "./page/aidCenter/adoptRequest/AdoptRequestList/AdoptRequestList";
import DoctorList from "./page/medicalCenter/doctor/DoctorList/DoctorList";
import DoctorCreate from "./page/medicalCenter/doctor/DoctorCreate/DoctorCreate";
import AppointmentList from "./page/medicalCenter/appointment/AppointmentList/AppointmentList";
import AppointmentListOfDoctor from "./page/doctorAccount/appointment/AppointmentListOfDoctor";
import { DataProvider } from "./context/DataProvider";
import ExecuteAppointment from "./page/doctorAccount/ExecuteAppointment/ExecuteAppointment";

function App() {
  const ROLE_ADMIN = "ROLE_ADMIN";
  const ROLE_SHOP = "ROLE_SHOP";
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER";
  const ROLE_AID_CENTER = "ROLE_AID_CENTER";
  const ROLE_DOCTOR = "ROLE_DOCTOR";

  const AuthRoute = ({ children, roles }) => {
    const { role } = useAuth();

    return roles.includes(role) ? (
      children
    ) : (
      <Navigate to="/unauthorized" replace />
    );
  };

  return (
    <div className="App">
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-shop" element={<RegisterShop />} />
            <Route path="/register-shelter" element={<RegisterShelter />} />
            <Route
              path="/register-medical-center"
              element={<RegisterMedicalCenter />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* auth routes */}
            <Route
              path="/dashboard"
              element={
                <AuthRoute
                  roles={[
                    ROLE_ADMIN,
                    ROLE_SHOP,
                    ROLE_MEDICAL_CENTER,
                    ROLE_AID_CENTER,
                    ROLE_DOCTOR,
                  ]}
                >
                  <Layout />
                </AuthRoute>
              }
            >
              <Route index element={<Dashboard />} />

              <Route path="support" element={<HelpSupport />} />
              <Route path="settings" element={<Settings />} />

              {/* Shop routes */}
              <Route
                path="product-list"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <ProductList />
                  </AuthRoute>
                }
              />
              <Route
                path="product-create"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <ProductCreate />
                  </AuthRoute>
                }
              />
              <Route
                path="product-view/:id"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <ProductDetail />
                  </AuthRoute>
                }
              />
              <Route
                path="product-update/:id"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <ProductUpdate />
                  </AuthRoute>
                }
              />
              <Route
                path="invoice-list"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <InvoiceList />
                  </AuthRoute>
                }
              />
              <Route
                path="invoice-view/:id"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <InvoiceDetail />
                  </AuthRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <AuthRoute roles={[ROLE_SHOP]}>
                    <Profile />
                  </AuthRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="shop-list"
                element={
                  <AuthRoute roles={[ROLE_ADMIN]}>
                    <AdminShopList />
                  </AuthRoute>
                }
              />
              <Route
                path="shop-view/:id"
                element={
                  <AuthRoute roles={[ROLE_ADMIN]}>
                    <AdminShopDetail />
                  </AuthRoute>
                }
              />
              <Route
                path="medical-center-list"
                element={
                  <AuthRoute roles={[ROLE_ADMIN]}>
                    <AdminMedicalCenterList />
                  </AuthRoute>
                }
              />
              <Route
                path="medical-center-view/:id"
                element={
                  <AuthRoute roles={[ROLE_ADMIN]}>
                    <AdminMedicalCenterDetail />
                  </AuthRoute>
                }
              />
              <Route
                path="aid-center-list"
                element={
                  <AuthRoute roles={[ROLE_ADMIN]}>
                    <AdminAidCenterList />
                  </AuthRoute>
                }
              />
              <Route
                path="aid-center-view/:id"
                element={
                  <AuthRoute roles={[ROLE_ADMIN]}>
                    <AdminAidCenterDetail />
                  </AuthRoute>
                }
              />

              {/* Aid Center routes */}
              <Route
                path="pet-list"
                element={
                  <AuthRoute roles={[ROLE_AID_CENTER]}>
                    <PetList />
                  </AuthRoute>
                }
              />
              <Route
                path="pet-create"
                element={
                  <AuthRoute roles={[ROLE_AID_CENTER]}>
                    <PetCreate />
                  </AuthRoute>
                }
              />
              <Route
                path="pet-view/:id"
                element={
                  <AuthRoute roles={[ROLE_AID_CENTER]}>
                    <PetDetail />
                  </AuthRoute>
                }
              />
              <Route
                path="pet-update/:id"
                element={
                  <AuthRoute roles={[ROLE_AID_CENTER]}>
                    <PetUpdate />
                  </AuthRoute>
                }
              />
              <Route
                path="adopt-request-list"
                element={
                  <AuthRoute roles={[ROLE_AID_CENTER]}>
                    <AdoptRequestList />
                  </AuthRoute>
                }
              />
              <Route
                path="doctor-list"
                element={
                  <AuthRoute roles={[ROLE_MEDICAL_CENTER]}>
                    <DoctorList />
                  </AuthRoute>
                }
              />
              <Route
                path="doctor-create"
                element={
                  <AuthRoute roles={[ROLE_MEDICAL_CENTER]}>
                    <DoctorCreate />
                  </AuthRoute>
                }
              />
              <Route
                path="appointment-list"
                element={
                  <AuthRoute roles={[ROLE_MEDICAL_CENTER]}>
                    <AppointmentList />
                  </AuthRoute>
                }
              />

              <Route
                path="doctor-appointment-list"
                element={
                  <AuthRoute roles={[ROLE_DOCTOR]}>
                    <AppointmentListOfDoctor />
                  </AuthRoute>
                }
              />
              <Route
                path="execute-appointment"
                element={
                  <AuthRoute roles={[ROLE_DOCTOR]}>
                    <ExecuteAppointment />
                  </AuthRoute>
                }
              />
            </Route>

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Not Found Page */}
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </DataProvider>
    </div>
  );
}

export default App;
