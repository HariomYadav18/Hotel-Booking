// pages/api/hotels/index.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(); // picks default DB from MONGODB_URI

  if (req.method === 'GET') {
    try {
      const hotels = await db.collection('hotels').find({}).toArray();
      return res.status(200).json(hotels);
    } catch (error) {
      console.error('GET /api/hotels error:', error);
      return res.status(500).json({ error: 'Unable to fetch hotels' });
    }
  }

  if (req.method === 'POST') {
    try {
      const newHotel = req.body;
      // optional: validate newHotel against a schema in lib/validators.js
      const result = await db.collection('hotels').insertOne(newHotel);
      return res.status(201).json({ ...newHotel, _id: result.insertedId });
    } catch (error) {
      console.error('POST /api/hotels error:', error);
      return res.status(500).json({ error: 'Unable to create hotel' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
