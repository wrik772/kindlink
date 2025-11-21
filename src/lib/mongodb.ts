import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI. Set it in your environment variables.");
}

const uri: string = MONGODB_URI;

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

// ⚠️ FIX: Ensure cached is always initialized
const cached = global.mongooseConnection || {
  conn: null,
  promise: null,
};

// ⚠️ Update global to avoid redefinition during hot reloads
global.mongooseConnection = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}