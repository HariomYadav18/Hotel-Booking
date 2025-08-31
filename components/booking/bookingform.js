import { useState } from 'react';
import { useRouter } from 'next/router';

export default function BookingForm() {
  const [formData, setFormData] = useState({ userId: '', serviceId: '', date: '', time: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) router.push('/bookings');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="userId" placeholder="User ID" onChange={handleChange} required />
      <input name="serviceId" placeholder="Service ID" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="time" onChange={handleChange} required />
      <button type="submit">Create Booking</button>
    </form>
  );
}
