import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export default function useChits() {
  const [chits, setChits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/chit`)
      .then(res => setChits(res.data))
      .catch(err => setError(err.message || "Error fetching chits"))
      .finally(() => setLoading(false));
  }, []);

  return { chits, loading, error };
}
