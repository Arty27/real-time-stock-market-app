import "dotenv/config";
import mongoose from "mongoose";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI must be set in .env");
    process.exit(1);
  }
  try {
    const startedAt = Date.now();
    await mongoose.connect(uri, { bufferCommands: false });
    const elapsed = Date.now() - startedAt;
    const dbName = mongoose.connection.name || "(unkown)";
    const host = mongoose.connection.host || "(unkown)";
    console.log(
      `OK: Connected to MongoDB [db="${dbName}", host="${host}", time=${elapsed}ms]`,
    );
    await mongoose.connection.close();
  } catch (error) {
    console.error("ERROR: Database connection failed");
    console.error(error);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
}

main();
