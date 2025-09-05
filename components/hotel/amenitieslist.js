export default function AmenitiesList({ amenities = [] }) {
  const amenityIcons = {
    Pool: '🏊',
    Spa: '💆',
    WiFi: '📶',
    Gym: '💪',
    Restaurant: '🍽️',
    Bar: '🍸',
    Parking: '🚗',
    Heater: '🔥',
    'Room Service': '🛎️',
    'Air Conditioning': '❄️'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-xl">{amenityIcons[amenity] || '✅'}</span>
          <span className="text-sm font-medium">{amenity}</span>
        </div>
      ))}
    </div>
  );
}

