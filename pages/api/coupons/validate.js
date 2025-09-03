// /pages/api/coupons/validate.js
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { code, bookingAmount } = req.body;

  if (!code || typeof bookingAmount !== 'number') {
    return res.status(400).json({ error: 'Coupon code and bookingAmount are required' });
  }

  const client = await clientPromise;
  const db = client.db();
  const couponsCol = db.collection('coupons');

  try {
    const coupon = await couponsCol.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (bookingAmount < coupon.minAmount) {
      return res.status(400).json({ error: `Minimum booking amount is ₹${coupon.minAmount}` });
    }

    return res.status(200).json({ valid: true, discountPercent: coupon.discountPercent });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return res.status(500).json({ error: 'Validation failed' });
  }
}
