// pages/api/hotels/search.js
import clientPromise from '../../../lib/mongodb';
import hotelsData from '../../../data/hotels.json';
import { DEMO_MODE } from '../../../lib/constants';

export default async function handler(req, res) {
  const client = DEMO_MODE ? null : await clientPromise;
  const db = DEMO_MODE ? null : client.db();
  const { q = '', amenity } = req.query;

  // Build regex for case-insensitive partial match
  const textFilter = {
    $or: [
      { name:    { $regex: q, $options: 'i' } },
      { city:    { $regex: q, $options: 'i' } },
    ]
  };

  // If amenity filter is provided
  const amenityFilter = amenity
    ? { amenities: amenity }
    : {};

  try {
    if (DEMO_MODE) {
      const qLower = String(q).toLowerCase();
      const filtered = hotelsData.filter(h =>
        h.name?.toLowerCase().includes(qLower) || h.city?.toLowerCase().includes(qLower)
      ).filter(h => (amenity ? (h.amenities || []).includes(amenity) : true));
      return res.status(200).json(filtered);
    }
    const hotels = await db
      .collection('hotels')
      .find({ ...textFilter, ...amenityFilter })
      .toArray();

    return res.status(200).json(hotels);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}
