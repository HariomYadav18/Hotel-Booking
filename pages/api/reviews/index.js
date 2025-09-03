// /pages/api/reviews/index.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const reviewsCol = db.collection('reviews');

  if (req.method === 'GET') {
    const { hotelId, guestEmail } = req.query;
    const filter = {};

    if (hotelId && ObjectId.isValid(hotelId)) {
      filter.hotelId = new ObjectId(hotelId);
    }
    if (guestEmail) {
      filter.guestEmail = guestEmail;
    }

    try {
      const reviews = await reviewsCol
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('GET /api/reviews error:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  if (req.method === 'POST') {
    const { hotelId, guestEmail, rating, comment = '' } = req.body;

    if (!hotelId || !guestEmail || typeof rating !== 'number') {
      return res.status(400).json({ error: 'hotelId, guestEmail, and numeric rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const newReview = {
      hotelId: new ObjectId(hotelId),
      guestEmail,
      rating,
      comment,
      createdAt: new Date()
    };

    try {
      const result = await reviewsCol.insertOne(newReview);
      return res.status(201).json({ _id: result.insertedId, ...newReview });
    } catch (error) {
      console.error('POST /api/reviews error:', error);
      return res.status(500).json({ error: 'Failed to create review' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
