import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Chit Fund</Link>
      <div>
        {!user ? (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/" className="mr-4">Dashboard</Link>
            <Link to="/auctions" className="mr-4">Auctions</Link>
            <Link to="/emis" className="mr-4">EMIs</Link>
            <Link to="/past-auctions" className="mr-4">Past Auctions</Link>
            <span className="mr-2">{user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
