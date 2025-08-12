import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/auctions/live").then(res => setAuctions(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Live Auctions</h2>
      <ul>
        {auctions.map(auction => (
          <li key={auction.id} className="mb-3 p-3 border rounded shadow flex items-center justify-between">
            <span>{auction.chitName} &mdash; {new Date(auction.auctionDate).toLocaleDateString()}</span>
            <button
              className="bg-green-600 px-4 py-1 text-white rounded hover:bg-green-700"
              onClick={() => navigate(`/auctions/${auction.id}`)}>
              Join Auction
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
