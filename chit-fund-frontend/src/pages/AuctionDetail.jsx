import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

const socket = io("http://localhost:3001");

export default function AuctionDetail() {
  const { auctionId } = useParams();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [yourBid, setYourBid] = useState("");
  const [error, setError] = useState("");
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    api.get(`/api/auctions/${auctionId}`).then(res => setAuction(res.data));
    socket.emit("join-auction", { auctionId, customerId: user.id });

    socket.on("new-bid", bid => setBids(prev => [bid, ...prev]));

    return () => socket.disconnect();
  }, [auctionId, user.id]);

  const placeBid = e => {
    e.preventDefault();
    setError("");
    if (!yourBid || +yourBid < 1000) { setError("Min bid 1000"); return; }
    socket.emit("place-bid", {
      auctionId, customerId: user.id, amount: Number(yourBid),
    });
    setYourBid("");
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Auction Details</h2>
      {auction &&
        <div className="mb-4">
          <p><b>Chit:</b> {auction.chitName}</p>
          <p><b>Date:</b> {new Date(auction.auctionDate).toLocaleDateString()}</p>
        </div>
      }
      <form onSubmit={placeBid} className="mb-4 flex">
        <input type="number" min="1000" step="100"
          value={yourBid}
          onChange={e => setYourBid(e.target.value)}
          placeholder="Your Bid Amount"
          className="border px-4 py-2 mr-2 rounded w-40"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded" type="submit">Bid</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <h3 className="font-semibold mb-2">Live Bids</h3>
      <ul>
        {bids.length === 0 && <li>No bids yet.</li>}
        {bids.map(bid => (
          <li key={bid.id} className="border-b py-1">
            {bid.customer?.name || bid.customerId} bid {bid.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
