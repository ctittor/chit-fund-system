// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AuctionPage from "./pages/AuctionPage";
// Import other pages as you create them, e.g.:
import CustomerPage from "./pages/CustomerPage";
import ChitPage from "./pages/ChitPage";
import EmiPage from "./pages/EmiPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import LoginPage from "./pages/LoginPage";
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auctions" element={<AuctionPage />} />
        {/* Add other routes here as you build those pages */}
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/chits" element={<ChitPage />} />
        <Route path="/emi" element={<EmiPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
