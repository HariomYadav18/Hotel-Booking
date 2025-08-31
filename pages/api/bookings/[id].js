// pages/api/bookings/[id].js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const bookingsCol = db.collection('bookings');
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }
  const filter = { _id: new ObjectId(id) };

  if (req.method === 'GET') {
    const booking = await bookingsCol.findOne(filter);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.status(200).json(booking);
  }

  if (req.method === 'PUT') {
    const updates = req.body;
    try {
      await bookingsCol.updateOne(filter, { $set: updates });
      const updated = await bookingsCol.findOne(filter);
      return res.status(200).json(updated);
    } catch (error) {
      console.error('PUT /api/bookings/[id] error:', error);
      return res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const booking = await bookingsCol.findOne(filter);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });

      const now = new Date();
      const diffDays = (booking.checkIn - now) / (1000 * 60 * 60 * 24);
      if (diffDays < 2) {
        return res
          .status(400)
          .json({ error: 'Refund not allowed within 2 days of check-in' });
      }

      // Deduction rules: 30% if <7 days, else 10%
      const deduction = diffDays < 7 ? 0.3 : 0.1;
      const refundAmount = booking.pricing.total * (1 - deduction);

      await bookingsCol.updateOne(filter, {
        $set: { status: 'cancelled', cancelledAt: new Date(), refundAmount }
      });

      return res.status(200).json({ refundAmount });
    } catch (error) {
      console.error('DELETE /api/bookings/[id] error:', error);
      return res.status(500).json({ error: 'Cancellation failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
