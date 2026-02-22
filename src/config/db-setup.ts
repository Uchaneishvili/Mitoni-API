import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import logger from "../utils/logger";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.DISABLE_SQL_LOGGER === "true" ? [] : ["query", "info", "warn", "error"],
});

const testDbConnection = async () => {
  try {
    await prisma.$connect();
    logger.info("Connection has been established successfully.");
    return true;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    return false;
  }
};

const closeDatabase = async () => {
  try {
    await prisma.$disconnect();
    await pool.end();
    logger.info("Database connection closed.");
  } catch (error) {
    logger.error("Error closing database connection:", error);
  }
};

export { prisma as db, testDbConnection, closeDatabase };
