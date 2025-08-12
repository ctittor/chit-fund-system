import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";

const PAGE_SIZE = 10;

export default function ManageEMIs() {
  const [emis, setEmis] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customerId: "", chitId: "", amount: "", dueDate: "", status: "PENDING" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { getEMIs(); getCustomers(); }, [page]);
  const getCustomers = async() => { 
    try { const res = await api.get("/api/admin/customers"); setCustomers(res.data.customers || res.data); } catch{}
  }
  const getEMIs = async() => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/emis", { params: { page, pageSize: PAGE_SIZE } });
      setEmis(res.data.emis); setTotalPages(res.data.totalPages);
    } catch { setErr("Failed to load EMIs."); } finally{ setLoading(false);}
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setMsg(""); setErr("");
    if (!form.customerId || !form.amount || !form.dueDate) { setErr("All fields required."); return; }
    try {
      if (editing) {
        await api.put(`/api/admin/emis/${editing.id}`, form);
        setMsg("EMI updated.");
      } else {
        await api.post("/api/admin/emis", form);
        setMsg("EMI created.");
      }
      setForm({ customerId:"", chitId: "", amount:"", dueDate:"", status:"PENDING" });
      setEditing(null);
      getEMIs();
    } catch (err) { setErr("Save failed."); }
  };

  const handleEdit = emi => {
    setEditing(emi);
    setForm({
      customerId: emi.customerId, chitId: emi.chitId, amount: emi.amount,
      dueDate: emi.dueDate.slice(0,10), status: emi.status
    });
  };
  const handleDelete = async id => {
    if(!window.confirm("Delete this EMI?")) return;
    try { await api.delete(`/api/admin/emis/${id}`); setMsg("EMI deleted."); getEMIs(); }
    catch{ setErr("Delete failed."); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage EMIs</h2>
      {msg && <Alert type="success" message={msg} />}{err && <Alert message={err} />}
      <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-3 rounded">
        <select name="customerId" value={form.customerId} onChange={handleChange} className="mb-2 p-2 border rounded">
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Input name="amount" label="Amount" type="number" value={form.amount} onChange={handleChange} />
        <Input name="dueDate" label="Due Date" type="date" value={form.dueDate} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange} className="mb-2 p-2 border rounded w-full">
          {["PAID","PENDING","MISSED"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button type="submit">{editing ? "Update" : "Create"}</Button>
        {editing && <Button type="button" className="bg-gray-400 ml-2" onClick={()=>{ setEditing(null); setForm({ customerId: "", chitId:"", amount:"", dueDate:"", status:"PENDING" }); }}>Cancel</Button>}
      </form>
      <table className="w-full border mb-3">
        <thead>
          <tr><th className="border px-2">Customer</th><th className="border px-2">Amount</th><th className="border px-2">Due Date</th><th className="border px-2">Status</th><th className="border px-2">Actions</th></tr>
        </thead>
        <tbody>
        {emis.map(e => (
          <tr key={e.id}>
            <td className="border px-2">{e.customer?.name || e.customerId}</td>
            <td className="border px-2">{e.amount}</td>
            <td className="border px-2">{e.dueDate.slice(0, 10)}</td>
            <td className="border px-2">{e.status}</td>
            <td className="border px-2">
              <button onClick={()=>handleEdit(e)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={()=>handleDelete(e.id)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        <Button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
        <span>Page {page} of {totalPages}</span>
        <Button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button>
      </div>
    </div>
  );
}
