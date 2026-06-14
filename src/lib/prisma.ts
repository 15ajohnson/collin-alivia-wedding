import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

// set write-ahead logging mode
prisma.$executeRaw`PRAGMA journal_mode = WAL;`
  .then(() => {
    console.log("Database connection established and journal mode set to WAL.");
  })
  .catch((error) => {
    console.error("Error setting journal mode to WAL:", error);
  });

export { prisma };
