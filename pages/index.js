// pages/index.js
import Link from 'next/link';
import SearchBar from '../components/search/searchbar';
import useHotels from '../hooks/useHotels';
import HotelCard from '../components/hotel/hotelcard';
import LoadingSpinner from '../components/common/loadingspinner';

export default function HomePage() {
  const { hotels, loading, error } = useHotels();

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Failed to load hotels.</p>;

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl gradient-primary text-white px-6 py-12 sm:py-16 mb-10">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/placeholder-hotel.jpg')] bg-cover bg-center" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-md">Find Your Perfect Stay</h1>
          <p className="mt-3 text-white/90">Discover top-rated hotels, cozy rooms, and exclusive deals for your next trip.</p>
          <div className="mt-6 bg-white/90 backdrop-blur rounded-xl p-3 shadow-sm">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold">Featured Hotels</h2>
          <Link href="/hotels" className="text-primary-700 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.slice(0, 6).map((hotel) => (
            <Link key={hotel._id || hotel.id} href={`/hotels/${hotel._id || hotel.id}`} className="block">
              <HotelCard hotel={hotel} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
