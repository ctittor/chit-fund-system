import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const res = await api.get('/api/super-admin/users');
      setAdmins(res.data);
    } catch {
      setMessage('Failed to load admins');
    }
  };

  const addAdmin = async () => {
    if (!newEmail) return;
    setLoading(true);
    setMessage('');
    try {
      await api.post('/api/super-admin/admins', { email: newEmail, password: 'Default123!', role: 'ADMIN' });
      setNewEmail('');
      setMessage('Admin created successfully');
      loadAdmins();
    } catch {
      setMessage('Error creating admin');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Admins</h2>
      <input
        type="email"
        className="border p-2 rounded w-full mb-3"
        placeholder="New Admin Email"
        value={newEmail}
        onChange={e => setNewEmail(e.target.value)}
      />
      <button onClick={addAdmin} disabled={loading} className="bg-blue-600 px-4 py-2 text-white rounded">
        {loading ? 'Creating...' : 'Add Admin'}
      </button>
      {message && <p className="mt-2">{message}</p>}

      <ul className="mt-6 space-y-2">
        {admins.map(admin => (
          <li key={admin.id}>{admin.email} ({admin.role})</li>
        ))}
      </ul>
    </div>
  );
}
