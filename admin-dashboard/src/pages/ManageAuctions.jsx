import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";

const PAGE_SIZE = 10;

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [form, setForm] = useState({ chitId: "", auctionDate: "", status: "SCHEDULED" });
  const [chits, setChits] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/admin/chits").then(r => setChits(r.data)).catch(() => {});
    getAuctions();
    // eslint-disable-next-line
  }, [page]);

  const getAuctions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/auctions", { params: { page, pageSize: PAGE_SIZE } });
      setAuctions(res.data.auctions);
      setTotalPages(res.data.totalPages);
    } catch { setError("Failed to load auctions."); } finally { setLoading(false); }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!form.chitId || !form.auctionDate) { setError("Chit and date required."); return; }
    try {
      if (editing) {
        await api.put(`/api/admin/auctions/${editing.id}`, form);
        setMessage("Auction updated.");
      } else {
        await api.post("/api/admin/auctions", form);
        setMessage("Auction created.");
      }
      setForm({ chitId: "", auctionDate: "", status: "SCHEDULED" });
      setEditing(null);
      getAuctions();
    } catch { setError("Error saving auction."); }
  };

  const handleEdit = a => { setEditing(a); setForm({ chitId: a.chitId, auctionDate: a.auctionDate.slice(0,10), status: a.status }); }
  const handleDelete = async id => {
    if (!window.confirm("Delete this auction?")) return;
    try { await api.delete(`/api/admin/auctions/${id}`); setMessage("Auction deleted."); getAuctions(); }
    catch { setError("Could not delete"); }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Auctions</h2>
      {error && <Alert message={error} />}
      {message && <Alert type="success" message={message} />}
      <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-3 rounded">
        <select name="chitId" value={form.chitId} onChange={handleChange} className="mb-2 p-2 border rounded">
          <option value="">Select Chit</option>
          {chits.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Input name="auctionDate" label="Auction Date" type="date" value={form.auctionDate} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange} className="mb-2 p-2 border rounded w-full">
          {["SCHEDULED","RUNNING","COMPLETED"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Button type="submit">{editing ? "Update" : "Create"}</Button>
        {editing && <Button type="button" className="bg-gray-500 ml-2" onClick={()=>{setEditing(null); setForm({ chitId: "", auctionDate: "", status: "SCHEDULED" });}}>Cancel</Button>}
      </form>
      <table className="w-full border mb-3">
        <thead>
          <tr><th className="border px-2">Chit</th><th className="border px-2">Date</th><th className="border px-2">Status</th><th className="border px-2">Actions</th></tr>
        </thead>
        <tbody>
        {auctions.map(a => (
          <tr key={a.id}>
            <td className="border px-2">{a.chit?.name || a.chitId}</td>
            <td className="border px-2">{a.auctionDate.slice(0,10)}</td>
            <td className="border px-2">{a.status}</td>
            <td className="border px-2">
              <button onClick={()=>handleEdit(a)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={()=>handleDelete(a.id)} className="text-red-600">Delete</button>
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
