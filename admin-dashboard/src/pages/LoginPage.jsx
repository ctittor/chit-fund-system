import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // fix here

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, role } = res.data;
      login(token);
      if (role === "SUPER_ADMIN") navigate("/super-admin/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
      else setError("Unauthorized role in admin portal");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-center text-2xl font-semibold mb-6">Admin Login</h2>
      {error && <Alert message={error} />}
      <form onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button className='w-full mt-4' type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
