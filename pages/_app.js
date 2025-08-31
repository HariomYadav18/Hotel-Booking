// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout/Layout';
import { FilterProvider } from '../context/FilterContext';
import { BookingProvider } from '../context/BookingContext';

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
