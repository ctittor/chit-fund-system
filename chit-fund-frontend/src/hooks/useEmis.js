import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export default function useEmis() {
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/emi`)
      .then(res => setEmis(res.data))
      .catch(err => setError(err.message || "Error fetching EMIs"))
      .finally(() => setLoading(false));
  }, []);

  return { emis, loading, error };
}
