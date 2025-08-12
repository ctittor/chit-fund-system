import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export default function useAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/auction`)
      .then(res => setAuctions(res.data))
      .catch(err => setError(err.message || "Error fetching auctions"))
      .finally(() => setLoading(false));
  }, []);

  return { auctions, loading, error };
}
