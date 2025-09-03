// pages/api/hotels/[id].js
import { ObjectId } from 'mongodb';
import hotelsData from '../../../data/hotels.json';
import { DEMO_MODE } from '../../../lib/constants';

export default async function handler(req, res) {
  let db = null;
  if (!DEMO_MODE) {
    const { default: clientPromise } = await import('../../../lib/mongodb');
    const client = await clientPromise;
    db = client.db();
  }
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid hotel ID' });
  }

  const hotels = db.collection('hotels');

  switch (req.method) {
    case 'GET':
      try {
        if (DEMO_MODE) {
          const hotel = hotelsData.find(h => (h._id || h.id) == id);
          if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
          return res.status(200).json(hotel);
        }
        const hotel = await hotels.findOne({ _id: new ObjectId(id) });
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
        return res.status(200).json(hotel);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch hotel' });
      }

    case 'PUT':
      try {
        if (DEMO_MODE) {
          return res.status(200).json({ message: 'Demo mode: Not persisted' });
        }
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
        if (DEMO_MODE) {
          return res.status(200).json({ message: 'Demo mode: Not persisted' });
        }
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
