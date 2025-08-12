import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Alert from "../components/Alert";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/api/user/profile");
        setProfile(res.data);
        setForm({ name: res.data.name || "", phone: res.data.phone || "", email: res.data.email || "" });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    try {
      await api.put("/api/user/profile", form);
      setMessage("Profile updated successfully.");
      setEditMode(false);
      setProfile({ ...profile, ...form });
    } catch {
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      {error && <Alert message={error} />}
      {message && <Alert type="success" message={message} />}

      {!editMode ? (
        <div>
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Phone:</b> {profile.phone}</p>
          <Button onClick={() => setEditMode(true)} className="mt-4">Edit Profile</Button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          {/* Email usually read-only */}
          <Input label="Email" name="email" value={form.email} disabled />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          <div className="flex space-x-2 mt-4">
            <Button type="submit">Save</Button>
            <Button type="button" className="bg-gray-400" onClick={() => setEditMode(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
