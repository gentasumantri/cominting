import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: MONGODB_URI');
}

if (!process.env.MONGODB_KEEP_ALIVE) {
  throw new Error('Invalid environment variable: MONGODB_KEEP_ALIVE');
}

if (!process.env.MONGODB_CONNECTION_TIMEOUT) {
  throw new Error('Invalid environment variable: MONGODB_CONNECTION_TIMEOUT');
}

if (!process.env.MONGODB_SOCKET_TIMEOUT) {
  throw new Error('Invalid environment variable: MONGODB_SOCKET_TIMEOUT');
}

if (!process.env.MONGODB_DEFAULT_DB) {
  throw new Error('Invalid environment variable: MONGODB_DEFAULT_DB');
}

if (!process.env.MONGODB_DEFAULT_COLLECTION) {
  throw new Error('Invalid environment variable: MONGODB_DEFAULT_COLLECTION');
}

const uri = process.env.MONGODB_URI;
const defaultDB = process.env.MONGODB_DEFAULT_DB;
const options = {
  keepAlive: process.env.MONGODB_KEEP_ALIVE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: process.env.MONGODB_CONNECTION_TIMEOUT,
  socketTimeoutMS: process.env.MONGODB_SOCKET_TIMEOUT,
};

let cachedClient;
let cachedDb;

export const dbConnect = async (dbName) => {
  const isCached = cachedClient && cachedDb ? true : false;
  dbName = dbName ? dbName : defaultDB;

  if (!isCached) {
    let client = await clientPromise();
    let db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;
  }

  return {
    client: cachedClient,
    db: cachedDb,
    isCached,
  };
};

export const clientPromise = () => {
  let client;
  let conn;

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }

    conn = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    conn = client.connect();
  }

  return conn;
};
