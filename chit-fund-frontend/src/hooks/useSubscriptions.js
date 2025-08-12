import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/subscription`)
      .then(res => setSubscriptions(res.data))
      .catch(err => setError(err.message || "Error fetching subscriptions"))
      .finally(() => setLoading(false));
  }, []);

  return { subscriptions, loading, error };
}
