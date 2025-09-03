import { MongoClient } from 'mongodb';
import { DEMO_MODE } from './constants';

const uri = process.env.MONGODB_URI;
// MongoDB Node.js Driver v6 removed useUnifiedTopology/useNewUrlParser
// Keep options object for forward-compatibility if needed
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI && !DEMO_MODE) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (DEMO_MODE) {
  // Return a never-resolving promise to avoid accidental DB usage in demo
  clientPromise = new Promise(() => {});
} else if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise.
export default clientPromise;

// Helper function to get database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db('hotel-booking');
}

// Helper function to get collections
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}