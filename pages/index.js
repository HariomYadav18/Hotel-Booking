// pages/index.js
import Link from 'next/link';
import SearchBar from '../components/search/searchbar';
import { useHotels } from '../hooks/useHotels';
import HotelCard from '../components/hotel/hotelcard';
import LoadingSpinner from '../components/common/loadingspinner';

export default function HomePage() {
  const { hotels, loading, error } = useHotels();

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Failed to load hotels.</p>;

  return (
    <div className="mx-auto max-w-5xl px-4">
      <header className="py-8 text-center">
        <h1 className="text-4xl font-bold">Find Your Perfect Stay</h1>
        <SearchBar />
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Hotels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.slice(0, 6).map((hotel) => (
            <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
              <a>
                <HotelCard hotel={hotel} />
              </a>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
