export function validateBookingPayload(payload) {
  const required = ['hotelId', 'roomId', 'guestEmail', 'checkIn', 'checkOut', 'basePrice'];
  for (const key of required) {
    if (!payload[key]) return { valid: false, error: `${key} is required` };
  }
  return { valid: true };
}

export function validateCouponCode(code) {
  if (!code || typeof code !== 'string') return { valid: false, error: 'Invalid code' };
  return { valid: true };
}


