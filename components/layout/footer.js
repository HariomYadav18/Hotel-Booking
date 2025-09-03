export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between text-sm text-gray-600">
        <span>© {new Date().getFullYear()} Hotel Booking</span>
        <span>Built with Next.js + Tailwind</span>
      </div>
    </footer>
  );
}


