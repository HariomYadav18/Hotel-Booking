// pages/hotels/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HotelGallery from '../../components/Hotel/HotelGallery';
import AmenitiesList from '../../components/Hotel/AmenitiesList';
import RoomCard from '../../components/Hotel/RoomCard';
import ReviewCard from '../../components/Review/ReviewCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { fetcher } from '../../lib/utils';

export default function HotelDetailPage() {
  const { id } = useRouter().query;
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetcher(`/api/hotels/${id}`),
      fetcher(`/api/reviews/hotel?hotelId=${id}`)
    ])
      .then(([hotelData, reviewsData]) => {
        setHotel(hotelData);
        setReviews(reviewsData);
      })
      .catch(() => setError('Failed to load hotel details.'));
  }, [id]);

  if (error) return <ErrorMessage message={error} />;
  if (!hotel) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold">{hotel.name}</h1>
      <HotelGallery images={hotel.images} />

      <section>
        <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
        <AmenitiesList amenities={hotel.amenities} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotel.rooms.map((room) => (
            <RoomCard key={room.id} hotelId={hotel.id} room={room} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </section>
    </div>
  );
}
