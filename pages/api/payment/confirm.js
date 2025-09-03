import { confirmPayment, retrievePaymentIntent } from '../../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { paymentIntentId } = req.body;
  if (!paymentIntentId) {
    return res.status(400).json({ error: 'paymentIntentId is required' });
  }

  try {
    const intent = await retrievePaymentIntent(paymentIntentId);
    if (intent.status === 'requires_confirmation') {
      const confirmed = await confirmPayment(paymentIntentId);
      return res.status(200).json({ status: confirmed.status });
    }
    return res.status(200).json({ status: intent.status });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to confirm payment' });
  }
}


