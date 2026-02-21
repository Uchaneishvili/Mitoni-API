import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log:
        process.env.DISABLE_SQL_LOGGER === "true"
            ? []
            : ["query", "info", "warn", "error"],
});

const testDbConnection = async () => {
    try {
        await prisma.$connect();
        console.log("Connection has been established successfully.");
        return true;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return false;
    }
};

const runMigrations = async () => {
    try {
        await testDbConnection();
        console.log("Database migrations should be run via: npm run db:migrate");
        return true;
    } catch (error) {
        console.error("Migration error:", error);
        throw new Error("Migration Error");
    }
};

const initializeDatabase = async () => {
    try {
        await testDbConnection();
        console.log("Database initialization completed successfully.");
    } catch (error) {
        console.error("Database initialization failed:", error);
        throw error;
    }
};

const closeDatabase = async () => {
    try {
        await prisma.$disconnect();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error closing database connection:", error);
    }
};

(async () => {
    if (process.env.NODE_ENV !== "test") {
        await initializeDatabase();
    }
})();

export {
    prisma as db,
    testDbConnection,
    runMigrations,
    initializeDatabase,
    closeDatabase,
};