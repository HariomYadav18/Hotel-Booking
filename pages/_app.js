// pages/_app.js
import React from 'react';
import Layout from '../components/layout/layout'; // Make sure this is a default export
import { FilterProvider } from '../context/FilterContext';
import { BookingProvider } from '../context/BookingContext';
import '../styles/globals.css'; // Adjust path if needed

function MyApp({ Component, pageProps }) {
  return (
    <FilterProvider>
      <BookingProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BookingProvider>
    </FilterProvider>
  );
}

export default MyApp;
