// pages/hotels.js
import FilterSidebar from '../components/search/filtersidebar';
import HotelCard from '../components/hotel/hotelcard';
import { useFilter } from '../context/FilterContext';
import { useHotels } from '../hooks/useHotels';
import LoadingSpinner from '../components/common/loadingspinner';

export default function HotelsPage() {
  const { filters } = useFilter();
  const { hotels, loading, error } = useHotels(filters);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Could not load hotels.</p>;

  return (
    <div className="flex mx-auto max-w-7xl px-4 py-8">
      <aside className="w-1/4 pr-6">
        <FilterSidebar />
      </aside>
      <main className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
            <a>
              <HotelCard hotel={hotel} />
            </a>
          </Link>
        ))}
      </main>
    </div>
  );
}
