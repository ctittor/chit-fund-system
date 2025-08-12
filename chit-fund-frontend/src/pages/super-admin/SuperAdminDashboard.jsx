import React, { useEffect, useState } from "react";
import axios from "axios";

function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", role: "ADMIN" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/super-admin/users");
        setUsers(res.data);
      } catch (err) {
        setMessage("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/super-admin/admins", form);
      setUsers([...users, res.data.user]);
      setMessage("Admin created successfully!");
      setForm({ email: "", password: "", role: "ADMIN" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to create admin");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {message && <div className="mb-4 text-red-600">{message}</div>}

      <form className="mb-8 flex flex-col gap-2 w-80" onSubmit={handleSubmit}>
        <h2 className="font-semibold">Create New Admin</h2>
        <input
          name="email"
          placeholder="Admin Email"
          className="border p-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="border p-2"
          value={form.role}
          onChange={handleChange}
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>

      <h2 className="font-semibold mb-2">All Users</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SuperAdminDashboard;
