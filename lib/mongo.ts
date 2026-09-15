import mongoose from "mongoose";

const globalForMongo = globalThis as unknown as {
  mongo?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  if (!globalForMongo.mongo) {
    globalForMongo.mongo = { conn: null, promise: null };
  }

  if (globalForMongo.mongo.conn) {
    return globalForMongo.mongo.conn;
  }

  if (!globalForMongo.mongo.promise) {
    globalForMongo.mongo.promise = mongoose.connect(uri);
  }

  globalForMongo.mongo.conn = await globalForMongo.mongo.promise;
  return globalForMongo.mongo.conn;
}
