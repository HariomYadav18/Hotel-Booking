// pages/bookings.js
import { useBookings } from '../hooks/useBookings';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import BookingSummary from '../components/Booking/BookingSummary';

export default function MyBookingsPage() {
  const { bookings, loading, error } = useBookings();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load your bookings." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <BookingSummary key={b.id} booking={b} />
        ))
      )}
    </div>
  );
}
