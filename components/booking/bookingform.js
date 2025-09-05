import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatPrice } from '../../lib/utils';

export default function BookingForm({ hotel, selectedRoom, onRoomChange, dates, onDatesChange }) {
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hotel && dates.start && dates.end) {
      checkAvailability();
    }
  }, [hotel, dates]);

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/hotels/availability?hotelId=${hotel.id}&start=${dates.start.toISOString()}&end=${dates.end.toISOString()}`
      );
      const data = await response.json();
      setAvailableRooms(data.availableRooms || hotel.rooms);
    } catch (error) {
      console.error('Availability check failed:', error);
      setAvailableRooms(hotel.rooms);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, date) => {
    onDatesChange({ ...dates, [field]: date });
  };

  const calculateNights = () => {
    if (!dates.start || !dates.end) return 0;
    const diffTime = Math.abs(dates.end - dates.start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Select Your Stay</h2>
      
      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Check-in Date</label>
          <DatePicker
            selected={dates.start}
            onChange={(date) => handleDateChange('start', date)}
            minDate={new Date()}
            className="input-field w-full"
            placeholderText="Select check-in date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Check-out Date</label>
          <DatePicker
            selected={dates.end}
            onChange={(date) => handleDateChange('end', date)}
            minDate={dates.start || new Date()}
            className="input-field w-full"
            placeholderText="Select check-out date"
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium mb-2">Number of Guests</label>
        <select
          className="input-field"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
          ))}
        </select>
      </div>

      {/* Room Selection */}
      {dates.start && dates.end && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Room</label>
          {loading ? (
            <div className="text-center py-4">Checking availability...</div>
          ) : (
            <div className="space-y-3">
              {availableRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onRoomChange(room)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-600">Up to {room.capacity} guests</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">
                        {formatPrice(room.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {selectedRoom && dates.start && dates.end && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Room:</span>
              <span>{selectedRoom.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{guests}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>{formatPrice(selectedRoom.price * calculateNights())}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
