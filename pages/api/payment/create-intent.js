import { createPaymentIntent } from '../../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { amount, metadata } = req.body;
  if (!amount || Number.isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  try {
    const intent = await createPaymentIntent(Number(amount), metadata);
    return res.status(200).json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create payment intent' });
  }
}


