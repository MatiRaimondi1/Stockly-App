import "reflect-metadata"
import "pg";
import { DataSource } from "typeorm";

import { Product } from "./entities/Product";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: true,
    entities: [Product],
});
