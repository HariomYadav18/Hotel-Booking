// pages/api/hotels/[id].js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid hotel ID' });
  }

  const hotels = db.collection('hotels');

  switch (req.method) {
    case 'GET':
      try {
        const hotel = await hotels.findOne({ _id: new ObjectId(id) });
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
        return res.status(200).json(hotel);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch hotel' });
      }

    case 'PUT':
      try {
        const updateData = req.body;
        await hotels.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        const updated = await hotels.findOne({ _id: new ObjectId(id) });
        return res.status(200).json(updated);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update hotel' });
      }

    case 'DELETE':
      try {
        await hotels.deleteOne({ _id: new ObjectId(id) });
        return res.status(204).end();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete hotel' });
      }

    default:
      res.setHeader('Allow', ['GET','PUT','DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
