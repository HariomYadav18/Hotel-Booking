import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <img src="/logo.png" alt="Logo" className="h-7 w-7 rounded-md shadow-sm" />
          <span className="font-semibold tracking-tight group-hover:text-primary-700 transition-colors">Hotel Booking</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/hotels" className="text-gray-700 hover:text-primary-700 transition-colors">Hotels</Link>
          <Link href="/bookings" className="text-gray-700 hover:text-primary-700 transition-colors">My Bookings</Link>
        </nav>
      </div>
    </header>
  );
}


