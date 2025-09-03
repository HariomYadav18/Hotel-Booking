import React, { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
  hotelId: null,
  roomId: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  guestDetails: {
    name: '',
    email: '',
    phone: ''
  },
  pricing: {
    basePrice: 0,
    discount: 0
  },
  payment: {
    method: 'stripe',
    intentId: null
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATES':
      return { ...state, checkIn: action.payload.checkIn, checkOut: action.payload.checkOut };
    case 'SET_GUESTS':
      return { ...state, guests: action.payload };
    case 'SET_HOTEL_ROOM':
      return { ...state, hotelId: action.payload.hotelId, roomId: action.payload.roomId };
    case 'SET_GUEST_DETAILS':
      return { ...state, guestDetails: { ...state.guestDetails, ...action.payload } };
    case 'SET_PRICING':
      return { ...state, pricing: { ...state.pricing, ...action.payload } };
    case 'SET_PAYMENT':
      return { ...state, payment: { ...state.payment, ...action.payload } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext(undefined);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}


