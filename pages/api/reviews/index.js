// /pages/api/reviews/index.js
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { hotelId, guestEmail, rating, comment } = req.body;

        if (!hotelId || !rating) {
          return res.status(400).json({ error: 'Hotel ID and rating required' });
        }

        const review = await Review.create({
          hotelId,
          guestEmail,
          rating,
          comment,
        });

        res.status(201).json(review);
      } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
      }
      break;

    case 'GET':
      try {
        const { hotelId } = req.query;
        const reviews = await Review.find({ hotelId });
        const avgRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;

        res.status(200).json({ reviews, avgRating });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
