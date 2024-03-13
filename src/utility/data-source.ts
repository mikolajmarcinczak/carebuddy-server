import { DataSource } from "typeorm"
import { User } from "../entity/User"

import "reflect-metadata"
import * as dotenv from "dotenv"

dotenv.config();
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
    process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    ssl: true,
    synchronize: NODE_ENV === "dev",
    logging: NODE_ENV === "dev",
    entities: [User],
    migrations: [__dirname + "/migrations/*{.ts}"],
    subscribers: [],
})
