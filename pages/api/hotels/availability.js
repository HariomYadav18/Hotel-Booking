// pages/api/hotels/availability.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import hotelsData from '../../../data/hotels.json';
import { DEMO_MODE } from '../../../lib/constants';

export default async function handler(req, res) {
  const client = DEMO_MODE ? null : await clientPromise;
  const db = DEMO_MODE ? null : client.db();
  const { hotelId, start, end } = req.query;

  if (!ObjectId.isValid(hotelId)) {
    return res.status(400).json({ error: 'Invalid hotel ID' });
  }
  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end dates required' });
  }

  const hotelsCol    = db.collection('hotels');
  const bookingsCol  = db.collection('bookings');

  try {
    // 1. Get hotel and its rooms
    const hotel = DEMO_MODE
      ? hotelsData.find(h => (h._id || h.id) == hotelId)
      : await hotelsCol.findOne({ _id: new ObjectId(hotelId) });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    // 2. Find overlapping bookings
    const overlapping = DEMO_MODE ? [] : await bookingsCol.find({
      hotelId:     new ObjectId(hotelId),
      $or: [
        { checkIn:  { $lte: new Date(end) }, checkOut: { $gte: new Date(start) } }
      ]
    }).toArray();

    const bookedRoomIds = new Set(overlapping.map(b => b.roomId.toString()));

    // 3. Filter available rooms
    const availableRooms = hotel.rooms.filter(
      room => !bookedRoomIds.has(room.id.toString())
    );

    return res.status(200).json({ availableRooms });
  } catch (err) {
    console.error('Availability error:', err);
    return res.status(500).json({ error: 'Availability check failed' });
  }
}
