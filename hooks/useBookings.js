import { useCallback } from 'react';
import axios from 'axios';

export default function useBookings() {
  const createBooking = useCallback(async (payload) => {
    const { data } = await axios.post('/api/bookings', payload);
    return data;
  }, []);

  const getBooking = useCallback(async (id) => {
    const { data } = await axios.get(`/api/bookings/${id}`);
    return data;
  }, []);

  const updateBooking = useCallback(async (id, updates) => {
    const { data } = await axios.put(`/api/bookings/${id}`, updates);
    return data;
  }, []);

  const deleteBooking = useCallback(async (id) => {
    const { data } = await axios.delete(`/api/bookings/${id}`);
    return data;
  }, []);

  const getUserBookings = useCallback(async (email) => {
    const { data } = await axios.get('/api/bookings/user', { params: { email } });
    return data;
  }, []);

  return { createBooking, getBooking, updateBooking, deleteBooking, getUserBookings };
}


