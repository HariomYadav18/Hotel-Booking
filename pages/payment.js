import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from '../components/payment/stripecheckout';
import LoadingSpinner from '../components/common/loadingspinner';

export default function PaymentPage() {
  const router = useRouter();
  const { bookingId, amount } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/bookings/${bookingId}`)
        .then(res => res.json())
        .then(setBooking)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Complete Payment</h1>
      
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Booking ID:</span>
            <span className="font-mono">{booking.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">${amount}</span>
          </div>
        </div>
      </div>

      <StripeCheckout 
        amount={parseFloat(amount)} 
        metadata={{ bookingId: booking._id }}
      />
    </div>
  );
}

