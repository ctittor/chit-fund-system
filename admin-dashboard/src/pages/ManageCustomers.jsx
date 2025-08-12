import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";

const PAGE_SIZE = 10;

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [page, filter]);

  // Fetch customers from backend with pagination and filter query
  async function fetchCustomers() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/customers", {
        params: { page, pageSize: PAGE_SIZE, q: filter },
      });
      setCustomers(res.data.customers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  // Handle input change for create/edit form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Open edit form with customer data
  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setForm({ name: customer.name, phone: customer.phone });
    setMessage("");
    setError("");
  };

  // Close form and reset
  const cancelEdit = () => {
    setSelectedCustomer(null);
    setForm({ name: "", phone: "" });
    setMessage("");
    setError("");
  };

  // Submit create or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    try {
      if (selectedCustomer) {
        // Edit existing customer
        await api.put(`/api/admin/customers/${selectedCustomer.id}`, form);
        setMessage("Customer updated successfully.");
      } else {
        // Create new customer
        await api.post("/api/admin/customers", form);
        setMessage("Customer created successfully.");
      }
      cancelEdit();
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save customer");
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.delete(`/api/admin/customers/${id}`);
      setMessage("Customer deleted successfully.");
      fetchCustomers();
    } catch {
      setError("Failed to delete customer.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Customers</h2>

      {message && <Alert type="success" message={message} />}
      {error && <Alert message={error} />}

      {/* Filter/Search */}
      <div className="mb-4 flex items-center space-x-2">
        <Input
          placeholder="Search by name or phone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={() => { setPage(1); fetchCustomers(); }}>Search</Button>
      </div>

      {/* Customer Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">{selectedCustomer ? "Edit Customer" : "Add Customer"}</h3>
        <Input name="name" label="Name" value={form.name} onChange={handleChange} />
        <Input name="phone" label="Phone" value={form.phone} onChange={handleChange} />
        <div className="flex space-x-2">
          <Button type="submit">{selectedCustomer ? "Update" : "Create"}</Button>
          {selectedCustomer && (
            <Button type="button" className="bg-gray-400" onClick={cancelEdit}>Cancel</Button>
          )}
        </div>
      </form>

      {/* Customer List */}
      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">{c.phone}</td>
                <td className="border px-3 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => openEdit(c)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex mt-4 justify-center space-x-3">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="px-3 py-1 text-gray-700">Page {page} of {totalPages}</span>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}
