import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function HomePage() {
  const [emis, setEmis] = useState([]);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const emiRes = await api.get("/api/emi/my");
        setEmis(emiRes.data);
        const auctionRes = await api.get("/api/auctions/my");
        setAuctions(auctionRes.data);
      } catch (e) {}
    }
    loadData();
  }, []);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Welcome to Your Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your EMI Details</h2>
        {emis.length === 0 ? <p>No EMI records found.</p> : (
          <ul className="list-disc pl-6">
            {emis.map(e => (
              <li key={e.id}>{e.amount} - {e.status} - Due on: {new Date(e.dueDate).toLocaleDateString()}</li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Auctions</h2>
        {auctions.length === 0 ? <p>No auctions available.</p> : (
          <ul className="list-disc pl-6">
            {auctions.map(a => (
              <li key={a.id}>{a.chitName} - {new Date(a.auctionDate).toLocaleDateString()}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
