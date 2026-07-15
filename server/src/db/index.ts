import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {DATABASE_URL} from "@utils/config.util.js";

const client = postgres(DATABASE_URL, {
    ssl: {
        rejectUnauthorized: false,
    },
});

export const db = drizzle(client);