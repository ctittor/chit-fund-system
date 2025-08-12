import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

export default function PastAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [liveStats, setLiveStats] = useState({}); // { [auctionId]: { highestBid, bidCount } }

  useEffect(() => {
    api.get("/api/admin/past-auctions").then(res => setAuctions(res.data));
    socket.on("auction-stats", (stats) => setLiveStats(stats));
    socket.emit("subscribe-past-auctions");
    return () => socket.emit("unsubscribe-past-auctions");
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Past Auctions & Live Stats</h2>
      <table className="w-full border mb-3">
        <thead>
          <tr>
            <th className="border">Chit</th>
            <th className="border">Date</th>
            <th className="border">Status</th>
            <th className="border">Highest Bid</th>
            <th className="border">Total Bids</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map(a => (
            <tr key={a.id}>
              <td className="border px-2">{a.chit?.name || a.chitId}</td>
              <td className="border px-2">{a.auctionDate.slice(0,10)}</td>
              <td className="border px-2">{a.status}</td>
              <td className="border px-2">{liveStats[a.id]?.highestBid || a.highestBid || "-"}</td>
              <td className="border px-2">{liveStats[a.id]?.bidCount ?? a.bidCount ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
