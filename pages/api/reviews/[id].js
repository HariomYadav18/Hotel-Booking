// pages/api/reviews/[id].js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const reviewsCol = db.collection('reviews');
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }
  const filter = { _id: new ObjectId(id) };

  if (req.method === 'GET') {
    const review = await reviewsCol.findOne(filter);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    return res.status(200).json(review);
  }

  if (req.method === 'PUT') {
    const updates = {};
    const { rating, comment } = req.body;

    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
      }
      updates.rating = rating;
    }
    if (comment !== undefined) {
      updates.comment = comment;
    }

    try {
      await reviewsCol.updateOne(filter, { $set: updates });
      const updated = await reviewsCol.findOne(filter);
      return res.status(200).json(updated);
    } catch (error) {
      console.error('PUT /api/reviews/[id] error:', error);
      return res.status(500).json({ error: 'Failed to update review' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await reviewsCol.deleteOne(filter);
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
      return res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
      console.error('DELETE /api/reviews/[id] error:', error);
      return res.status(500).json({ error: 'Failed to delete review' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
