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
    <nav className="bg-gray-800 text-white flex justify-between items-center px-6 py-4">
      <div className="font-bold text-xl cursor-pointer">
        <Link to="/">Chit Fund Admin</Link>
      </div>
      <div>
        {!user ? (
          <Link to="/login" className="mr-4 hover:underline">Login</Link>
        ) : (
          <>
            {user.role === "SUPER_ADMIN" && (
              <>
                <Link to="/super-admin/dashboard" className="mr-4 hover:underline">Dashboard</Link>
                <Link to="/super-admin/manage-admins" className="mr-4 hover:underline">Manage Admins</Link>
              </>
            )}
            {user.role === "ADMIN" && (
              <>
                <Link to="/admin/dashboard" className="mr-4 hover:underline">Dashboard</Link>
                <Link to="/admin/manage-customers" className="mr-4 hover:underline">Customers</Link>
                <Link to="/admin/manage-auctions" className="mr-4 hover:underline">Auctions</Link>
                <Link to="/admin/manage-emis" className="mr-4 hover:underline">EMIs</Link>
                <Link to="/admin/past-auctions" className="mr-4 hover:underline">Past Auctions</Link>
              </>
            )}
            <span className="mr-4">{user.email}</span>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
