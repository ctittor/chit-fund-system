import React, { useEffect, useState } from "react";
import api from "../utils/api";
export default function EMIPage() {
  const [emis, setEmis] = useState([]);
  useEffect(() => {
    api.get("/api/emi/my").then(res => setEmis(res.data));
  }, []);
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your EMI Payments</h2>
      {emis.length === 0 ? <p>No EMI records found.</p> :
      <table className="w-full border">
        <thead>
          <tr><th className="px-4 py-2 border">Month</th><th className="px-4 py-2 border">Amount</th><th className="px-4 py-2 border">Status</th></tr>
        </thead>
        <tbody>
        {emis.map(e => (
          <tr key={e.id}>
            <td className="border px-4 py-2">{new Date(e.dueDate).toLocaleDateString()}</td>
            <td className="border px-4 py-2">{e.amount}</td>
            <td className="border px-4 py-2">{e.status}</td>
          </tr>
        ))}
        </tbody>
      </table>}
    </div>
  );
}
