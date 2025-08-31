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

export default function BookingPage() {
  const { hotelId } = useRouter().query;
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dates, setDates] = useState({ start: null, end: null });
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelId) return;
    fetcher(`/api/hotels/${hotelId}`)
      .then(setHotel)
      .catch(() => setError('Could not load hotel for booking.'));
  }, [hotelId]);

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

      <GuestDetails />

      <CouponInput coupon={coupon} onApply={setCoupon} />

      <BookingSummary
        hotel={hotel}
        room={selectedRoom}
        dates={dates}
        coupon={coupon}
      />
    </div>
  );
}
