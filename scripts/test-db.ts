import { connectToDatabase } from "@/database/mongoose";

async function main() {
  try {
    await connectToDatabase();
    console.log("OK: Database connection succeeded");
    process.exit(0);
  } catch (error) {
    console.error("ERROR: Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

main();
