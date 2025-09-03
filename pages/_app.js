// pages/_app.js
import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import Layout from '../components/layout/layout';
import { BookingProvider } from '../context/BookingContext';
import { FilterProvider } from '../context/FilterContext';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hotel Booking</title>
      </Head>
      <FilterProvider>
        <BookingProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </BookingProvider>
      </FilterProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default MyApp;
