// /pages/api/reviews/hotel.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { hotelId } = req.query;
  if (!hotelId || !ObjectId.isValid(hotelId)) {
    return res.status(400).json({ error: 'Valid hotelId query is required' });
  }

  const client = await clientPromise;
  const db = client.db();
  const reviewsCol = db.collection('reviews');

  try {
    const reviews = await reviewsCol
      .find({ hotelId: new ObjectId(hotelId) })
      .sort({ createdAt: -1 })
      .toArray();

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return res.status(200).json({ reviews, avgRating });
  } catch (error) {
    console.error('GET /api/reviews/hotel error:', error);
    return res.status(500).json({ error: 'Failed to fetch hotel reviews' });
  }
}
