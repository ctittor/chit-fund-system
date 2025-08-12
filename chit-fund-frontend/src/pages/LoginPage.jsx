import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data.token;
      const role = res.data.role;
      login(token);
      if (role === "SUPER_ADMIN") navigate("/super-admin/SuperAdminDashboard");
      else if (role === "ADMIN") navigate("/admin/AdminDashboard");
      else navigate("/"); // customer
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      {error && <Alert message={error} />}
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full mt-4">{loading ? "Logging in..." : "Login"}</Button>
      </form>
    </div>
  );
}
