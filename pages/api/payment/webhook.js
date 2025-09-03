import Stripe from 'stripe';
import { buffer } from 'micro';
import { DEMO_MODE } from '../../../lib/constants';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (DEMO_MODE || !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(200).json({ received: true, mode: 'demo' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // TODO: mark booking as paid based on metadata
        break;
      case 'payment_intent.payment_failed':
        // TODO: handle failed payment
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Webhook handling error:', error);
    return res.status(500).end();
  }

  res.json({ received: true });
}


