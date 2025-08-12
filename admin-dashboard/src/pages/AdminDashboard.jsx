import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="list-disc ml-8 space-y-2 text-blue-700">
        <li><Link to="/admin/manage-customers">Manage Customers</Link></li>
        <li><Link to="/admin/manage-auctions">Manage Auctions</Link></li>
        <li><Link to="/admin/manage-emis">Manage EMIs</Link></li>
        <li><Link to="/admin/past-auctions">Past Auctions</Link></li>
      </ul>
    </div>
  );
}
