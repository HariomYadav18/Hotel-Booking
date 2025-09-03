import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function InnerCheckout({ amount, metadata }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    async function createIntent() {
      const { data } = await axios.post('/api/payment/create-intent', { amount, metadata });
      setClientSecret(data.clientSecret);
    }
    createIntent();
  }, [amount, metadata]);

  if (!clientSecret) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings`,
      }
    });
    if (error) {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button disabled={!stripe || submitting} className="btn-primary w-full" type="submit">
        {submitting ? 'Processing…' : 'Pay now'}
      </button>
    </form>
  );
}

export default function PaymentForm({ amount, metadata }) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return <div className="text-red-600">Stripe publishable key not configured.</div>;
  }
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
      <InnerCheckout amount={amount} metadata={metadata} />
    </Elements>
  );
}


