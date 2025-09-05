// pages/booking/[hotelId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BookingForm from '../../components/booking/bookingform';
import BookingSummary from '../../components/booking/bookingsummary';
import CouponInput from '../../components/booking/couponinput';
import GuestDetails from '../../components/booking/guestdetails';
import LoadingSpinner from '../../components/common/loadingspinner';
import ErrorMessage from '../../components/common/errormessage';
import { fetcher } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { hotelId } = useRouter().query;
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dates, setDates] = useState({ start: null, end: null });
  const [coupon, setCoupon] = useState(null);
  const [guestDetails, setGuestDetails] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    fetcher(`/api/hotels/${hotelId}`)
      .then(setHotel)
      .catch(() => setError('Could not load hotel for booking.'));
  }, [hotelId]);

  const calculateNights = () => {
    if (!dates.start || !dates.end) return 0;
    const diffTime = Math.abs(dates.end - dates.start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const subtotal = selectedRoom.price * nights;
    const discount = coupon ? (subtotal * coupon.discountPercent / 100) : 0;
    return subtotal - discount;
  };

  const handlePayment = async () => {
    if (!selectedRoom || !dates.start || !dates.end) {
      toast.error('Please select room and dates');
      return;
    }
    if (!guestDetails.name || !guestDetails.email) {
      toast.error('Please fill in guest details');
      return;
    }

    setProcessing(true);
    try {
      // Create booking
      const bookingData = {
        hotelId,
        roomId: selectedRoom.id,
        guestEmail: guestDetails.email,
        checkIn: dates.start.toISOString(),
        checkOut: dates.end.toISOString(),
        guests: 1, // This should come from booking form
        basePrice: selectedRoom.price,
        discount: coupon ? (selectedRoom.price * calculateNights() * coupon.discountPercent / 100) : 0,
        paymentMethod: 'stripe'
      };

      const booking = await fetcher('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });

      // Redirect to payment
      window.location.href = `/payment?bookingId=${booking._id}&amount=${calculateTotal()}`;
    } catch (error) {
      toast.error('Failed to create booking');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (!hotel) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-semibold">Book: {hotel.name}</h1>

      <BookingForm
        hotel={hotel}
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
        dates={dates}
        onDatesChange={setDates}
      />

      <GuestDetails 
        value={guestDetails}
        onChange={setGuestDetails}
      />

      <CouponInput coupon={coupon} onApply={setCoupon} />

      <BookingSummary
        hotel={hotel}
        room={selectedRoom}
        dates={dates}
        coupon={coupon}
      />

      {selectedRoom && dates.start && dates.end && guestDetails.name && guestDetails.email && (
        <div className="card p-6">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-primary w-full text-lg py-4"
          >
            {processing ? 'Processing...' : `Pay ${calculateTotal().toFixed(2)} USD`}
          </button>
        </div>
      )}
    </div>
  );
}
