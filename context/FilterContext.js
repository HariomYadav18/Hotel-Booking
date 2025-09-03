import React, { createContext, useContext, useMemo, useReducer } from 'react';

const initialState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: 1,
  minPrice: 0,
  maxPrice: 1000,
  rating: 0,
  amenities: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.payload.key]: action.payload.value };
    case 'SET_DATES':
      return { ...state, checkIn: action.payload.checkIn, checkOut: action.payload.checkOut };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const FilterContext = createContext(undefined);

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be used within FilterProvider');
  return ctx;
}


