require("dotenv").config();

const mongoose = require("mongoose");

const MONGODB_URL =
  "mongodb+srv://jaifan:zakaria@cluster0.spttd.mongodb.net/NoonAPI?retryWrites=true&w=majority";

if (!MONGODB_URL) {
  console.log("Set MongoDb .env Variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
