// pages/api/bookings/index.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import { generateBookingId, generateTransactionId } from '../../../lib/utils';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const bookingsCol = db.collection('bookings');

  if (req.method === 'POST') {
    const {
      hotelId,
      roomId,
      guestEmail,
      checkIn,
      checkOut,
      guests,
      basePrice,
      discount = 0,
      paymentMethod
    } = req.body;

    // Basic validation
    if (!hotelId || !roomId || !guestEmail || !checkIn || !checkOut || !basePrice) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    // Calculate amounts (10% tax + 5% service)
    const nights = Math.max(
      1,
      Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    );
    const subtotal = basePrice * nights;
    const taxes = subtotal * 0.1;
    const serviceFee = subtotal * 0.05;
    const totalAmount = subtotal + taxes + serviceFee - discount;

    const newBooking = {
      bookingId: generateBookingId(),
      transactionId: paymentMethod === 'stripe' ? generateTransactionId() : null,
      hotelId: new ObjectId(hotelId),
      roomId: new ObjectId(roomId),
      guestEmail,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      pricing: { subtotal, taxes, serviceFee, discount, total: totalAmount },
      paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'confirmed',
      createdAt: new Date()
    };

    try {
      const result = await bookingsCol.insertOne(newBooking);
      return res.status(201).json({
        ...newBooking,
        _id: result.insertedId
      });
    } catch (error) {
      console.error('POST /api/bookings error:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  if (req.method === 'GET') {
    try {
      const allBookings = await bookingsCol.find({}).toArray();
      return res.status(200).json(allBookings);
    } catch (error) {
      console.error('GET /api/bookings error:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
