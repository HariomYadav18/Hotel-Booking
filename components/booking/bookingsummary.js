import { calculateTotalPrice, formatPrice } from '../../lib/utils';
import { useBooking } from '../../context/BookingContext';

export default function BookingSummary() {
  const { state } = useBooking();

  const nights = state.checkIn && state.checkOut
    ? Math.max(1, Math.ceil((new Date(state.checkOut) - new Date(state.checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;

  const pricing = calculateTotalPrice(state.pricing.basePrice, nights, state.guests, state.pricing.discount);

  return (
    <div className="card p-4 space-y-2">
      <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(pricing.subtotal)}</span></div>
      <div className="flex justify-between"><span>Taxes</span><span>{formatPrice(pricing.taxes)}</span></div>
      <div className="flex justify-between"><span>Service Fee</span><span>{formatPrice(pricing.serviceFee)}</span></div>
      {pricing.discount > 0 && (
        <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(pricing.discount)}</span></div>
      )}
      <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>{formatPrice(pricing.total)}</span></div>
    </div>
  );
}


