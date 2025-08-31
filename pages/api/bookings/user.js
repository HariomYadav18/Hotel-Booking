// pages/api/bookings/user.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const bookingsCol = db.collection('bookings');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email query required' });
  }

  try {
    const userBookings = await bookingsCol
      .find({ guestEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(userBookings);
  } catch (error) {
    console.error('GET /api/bookings/user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
}
