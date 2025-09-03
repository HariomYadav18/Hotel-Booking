// pages/api/hotels/index.js
import clientPromise from '../../../lib/mongodb';
import hotelsData from '../../../data/hotels.json';
import { DEMO_MODE } from '../../../lib/constants';

export default async function handler(req, res) {
  const client = DEMO_MODE ? null : await clientPromise;
  const db = DEMO_MODE ? null : client.db();

  if (req.method === 'GET') {
    try {
      if (DEMO_MODE) {
        return res.status(200).json(hotelsData);
      }
      const hotels = await db.collection('hotels').find({}).toArray();
      return res.status(200).json(hotels);
    } catch (error) {
      console.error('GET /api/hotels error:', error);
      return res.status(500).json({ error: 'Unable to fetch hotels' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (DEMO_MODE) {
        return res.status(200).json({ message: 'Demo mode: Not persisted' });
      }
      const newHotel = req.body;
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
