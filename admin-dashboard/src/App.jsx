import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ManageAdmins from "./pages/ManageAdmins";
import ManageCustomers from "./pages/ManageCustomers";
import ManageAuctions from "./pages/ManageAuctions";
import ManageEMIs from "./pages/ManageEMIs";
import PastAuctions from "./pages/PastAuctions";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/super-admin/dashboard" element={
            <ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>
          } />
          <Route path="/super-admin/manage-admins" element={
            <ProtectedRoute><ManageAdmins /></ProtectedRoute>
          } />
          <Route path="/admin/manage-customers" element={
            <ProtectedRoute><ManageCustomers /></ProtectedRoute>
          } />
          <Route path="/admin/manage-auctions" element={
            <ProtectedRoute><ManageAuctions /></ProtectedRoute>
          } />
          <Route path="/admin/manage-emis" element={
            <ProtectedRoute><ManageEMIs /></ProtectedRoute>
          } />
          <Route path="/admin/past-auctions" element={
            <ProtectedRoute><PastAuctions /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
