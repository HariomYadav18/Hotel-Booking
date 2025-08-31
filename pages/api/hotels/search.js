// pages/api/hotels/search.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
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
