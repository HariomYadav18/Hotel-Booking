import Image from 'next/image';
import { Star } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const { name, city, rating, images = [] } = hotel;
  const imageSrc = images[0] || '/images/placeholder-hotel.jpg';

  return (
    <div className="card overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] w-full">
        {/* Using img to avoid next/image domain config for demo URLs */}
        <img src={imageSrc} alt={name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute bottom-2 left-2">
          <span className="badge badge-primary bg-white/90 text-gray-800 backdrop-blur px-2 py-0.5 rounded-md text-xs shadow-sm">{city}</span>
        </div>
        <div className="absolute top-2 right-2 flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
          <span>{rating || '4.5'}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mt-0.5">{city}</p>
      </div>
    </div>
  );
}


