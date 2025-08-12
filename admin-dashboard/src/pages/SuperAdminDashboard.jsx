import React from 'react';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>
      <ul className="list-disc ml-8 space-y-2 text-blue-700">
        <li><Link to="/super-admin/manage-admins">Manage Admins</Link></li>
        {/* Add more super admin system control links here */}
      </ul>
    </div>
  );
}
