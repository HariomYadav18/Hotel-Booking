import { useState } from 'react';
import { useRouter } from 'next/router';
import { formatPrice } from '../../lib/utils';

export default function RoomCard({ hotelId, room }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBook = () => {
    setLoading(true);
    router.push(`/booking/${hotelId}?roomId=${room.id}`);
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-sm text-gray-600">Up to {room.capacity} guests</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-primary-600">
            {formatPrice(room.price)}
          </div>
          <div className="text-sm text-gray-500">per night</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="mr-2">👥</span>
          <span>Capacity: {room.capacity} guests</span>
        </div>
        {room.amenities && (
          <div className="flex items-center text-sm">
            <span className="mr-2">✨</span>
            <span className="text-gray-700">{room.amenities.join(', ')}</span>
          </div>
        )}
      </div>
      
      <button
        onClick={handleBook}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Loading...' : 'Book Now'}
      </button>
    </div>
  );
}

