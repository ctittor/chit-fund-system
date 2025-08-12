import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import api from "../utils/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", chitId: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.post("/api/auth/register", form);
      setMessage("Registration successful! Please login.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      {message && <Alert type={message.includes("success") ? "success" : "error"} message={message} />}
      <form onSubmit={handleSubmit}>
        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
        <Input label="Chit ID" name="chitId" value={form.chitId} onChange={handleChange} required />
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
        <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
      </form>
    </div>
  );
}
