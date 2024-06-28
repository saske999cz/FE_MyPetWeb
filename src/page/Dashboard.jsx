import React from 'react';
import { Navigate } from 'react-router-dom';
import ShopDashboard from './shop/dashboard/ShopDashboard';
import AdminDashboard from './admin/dashboard/AdminDashboard';
import MedicalCenterDashboard from './medicalCenter/dashboard/MedicalCenterDashboard';
import AidCenterDashboard from './aidCenter/dashboard/AidCenterDashboard';
import { useAuth } from '../utils/AuthContext';

const Dashboard = () => {
  const { role } = useAuth();
  const ROLE_ADMIN = "ROLE_ADMIN";
  const ROLE_SHOP = "ROLE_SHOP";
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER";
  const ROLE_AID_CENTER = "ROLE_AID_CENTER";

  switch(role) {
    case ROLE_ADMIN:
      return <AdminDashboard />;
    case ROLE_SHOP:
      return <ShopDashboard />;
    case ROLE_MEDICAL_CENTER:
      return <MedicalCenterDashboard />;
    case ROLE_AID_CENTER:
      return <AidCenterDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default Dashboard;