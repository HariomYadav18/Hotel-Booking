// /pages/api/bookings/index.js
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { hotelId, guestEmail, checkIn, checkOut, rooms, paymentMethod } = req.body;

        if (!hotelId || !guestEmail || !checkIn || !checkOut || !rooms) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newBooking = await Booking.create({
          hotelId,
          guestEmail,
          checkIn,
          checkOut,
          rooms,
          paymentMethod,
          status: 'confirmed',
        });

        res.status(201).json(newBooking);
      } catch (error) {
        res.status(500).json({ error: 'Booking failed' });
      }
      break;

    case 'GET':
      try {
        const { email } = req.query;
        const bookings = await Booking.find({ guestEmail: email });
        res.status(200).json(bookings);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
