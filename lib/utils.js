import { format, differenceInDays, parseISO } from 'date-fns';

// Format price with currency
export function formatPrice(price, currency = 'USD') {
  if (typeof price !== 'number' || isNaN(price)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Format date
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
}

// Calculate nights between dates
export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  try {
    const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
    return Math.max(0, differenceInDays(end, start));
  } catch {
    return 0;
  }
}

// Generate booking ID
export function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `BK-${timestamp}-${random}`;
}

// Generate transaction ID
export function generateTransactionId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

// Validate email
export function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone
export function validatePhone(phone) {
  if (!phone) return false;
  const re = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
  return re.test(phone.replace(/\s/g, ''));
}

// Calculate total price with breakdown
export function calculateTotalPrice(basePrice, nights, guests = 1, discount = 0) {
  if (!basePrice || !nights) return { subtotal: 0, taxes: 0, serviceFee: 0, discount: 0, total: 0 };
  
  const subtotal = basePrice * nights;
  const taxes = subtotal * 0.1; // 10% tax
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = Math.max(0, subtotal + taxes + serviceFee - discount);
  
  return { subtotal, taxes, serviceFee, discount, total };
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + '...';
}

// Class names helper (similar to clsx)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Get initials from name
export function getInitials(name) {
  if (!name) return 'NA';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate avatar color
export function generateAvatarColor(name = '') {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.charCodeAt(0) % colors.length || 0;
  return colors[index];
}

// Validate date range
export function validateDateRange(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return { valid: false, error: 'Please select both check-in and check-out dates' };
  }

  try {
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
  } catch {
    return { valid: false, error: 'Invalid date format' };
  }
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Enhanced fetcher for API calls
export async function fetcher(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        message = errorData.error || errorData.message || message;
      } catch {
        // Fallback to status text if JSON parsing fails
        message = response.statusText || message;
      }
      throw new Error(message);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
}

// Format query parameters
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.set(key, value.toString());
      }
    }
  });
  return searchParams.toString();
}

// Sleep utility for development
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if object is empty
export function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

// Deep clone object
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}