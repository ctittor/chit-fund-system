import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import EMIPage from "./pages/EMIPage";
import AuctionPage from "./pages/AuctionPage";
import AuctionDetail from "./pages/AuctionDetail";
import PastAuctions from "./pages/PastAuctions";

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                        <Route path="/emis" element={<PrivateRoute><EMIPage /></PrivateRoute>} />
                        <Route path="/auctions" element={<PrivateRoute><AuctionPage /></PrivateRoute>} />
                        <Route path="/auctions/:auctionId" element={<PrivateRoute><AuctionDetail /></PrivateRoute>} />
                        <Route path="/past-auctions" element={<PrivateRoute><PastAuctions /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}
export default App;
