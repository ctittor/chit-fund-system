import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api"; // Ensure this matches your backend port

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => setError(err.message || "Error fetching customers"))
      .finally(() => setLoading(false));
  }, []);

  return { customers, loading, error };
}
