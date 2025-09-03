import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          <span className="font-semibold">Hotel Booking</span>
        </Link>
        <nav className="space-x-4">
          <Link href="/hotels" className="text-gray-700 hover:text-gray-900">Hotels</Link>
          <Link href="/bookings" className="text-gray-700 hover:text-gray-900">My Bookings</Link>
        </nav>
      </div>
    </header>
  );
}


