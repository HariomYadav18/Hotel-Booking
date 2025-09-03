import Image from 'next/image';
import { Star } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const { name, city, rating, images = [] } = hotel;
  const imageSrc = images[0] || '/images/placeholder-hotel.jpg';

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 w-full">
        {/* Using img to avoid next/image domain config for demo URLs */}
        <img src={imageSrc} alt={name} className="h-40 w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="inline-flex items-center text-sm"><Star className="h-4 w-4 text-yellow-500 mr-1" />{rating || '4.5'}</span>
        </div>
        <p className="text-gray-600 text-sm">{city}</p>
      </div>
    </div>
  );
}


