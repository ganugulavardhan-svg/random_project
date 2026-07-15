import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {DATABASE_URL} from "@utils/config.util.js";

const client = postgres(DATABASE_URL, );

export const db = drizzle(client);