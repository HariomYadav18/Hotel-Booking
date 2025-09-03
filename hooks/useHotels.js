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
        // Normalize id field for UI components
        const normalized = (res.data || []).map(h => ({ ...h, id: h._id || h.id }));
        setHotels(normalized);
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
