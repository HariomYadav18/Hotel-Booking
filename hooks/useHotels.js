// hooks/useHotels.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useHotels(filters = {}) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get('/api/hotels', { params: filters });
        setHotels(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [JSON.stringify(filters)]);

  return { hotels, loading, error };
}
