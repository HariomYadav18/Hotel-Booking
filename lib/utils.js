import { format, differenceInDays, addDays, parseISO } from 'date-fns';

// Format price with currency
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Format date
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

// Calculate nights between dates
export function calculateNights(checkIn, checkOut) {
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  return differenceInDays(end, start);
}

// Generate booking ID
export function generateBookingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BK-${timestamp}-${random}`.toUpperCase();
}

// Generate transaction ID
export function generateTransactionId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TXN-${timestamp}-${random}`.toUpperCase();
}

// Validate email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone
export function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
}

// Calculate total price
export function calculateTotalPrice(basePrice, nights, guests, discount = 0) {
  const subtotal = basePrice * nights;
  const taxes = subtotal * 0.1; // 10% tax
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + taxes + serviceFee - discount;
  
  return {
    subtotal,
    taxes,
    serviceFee,
    discount,
    total
  };
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Class names helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Get initials from name
export function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  return parts
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate random color for avatar
export function generateAvatarColor(name) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  
  if (!name) return colors[0];
  
  const charCode = name.charCodeAt(0);
  const index = charCode % colors.length;
  return colors[index];
}

// Validate date range
export function validateDateRange(checkIn, checkOut) {
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (start < today) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }
  
  if (end <= start) {
    return { valid: false, error: 'Check-out date must be after check-in date' };
  }
  
  const nights = differenceInDays(end, start);
  if (nights > 30) {
    return { valid: false, error: 'Maximum stay is 30 nights' };
  }
  
  return { valid: true, nights };
}

// Parse query parameters
export function parseQueryParams(query) {
  const params = {};
  
  if (query.location) params.location = query.location;
  if (query.checkIn) params.checkIn = query.checkIn;
  if (query.checkOut) params.checkOut = query.checkOut;
  if (query.guests) params.guests = parseInt(query.guests);
  if (query.minPrice) params.minPrice = parseFloat(query.minPrice);
  if (query.maxPrice) params.maxPrice = parseFloat(query.maxPrice);
  if (query.rating) params.rating = parseFloat(query.rating);
  if (query.amenities) {
    params.amenities = Array.isArray(query.amenities) 
      ? query.amenities 
      : query.amenities.split(',');
  }
  
  return params;
}

// Storage helpers
export const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  },
  
  remove: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },
  
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};