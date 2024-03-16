import { PrismaClient } from "@prisma/client"

import "reflect-metadata"
import * as dotenv from "dotenv"
import * as console from "console";

dotenv.config();
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
    process.env;

class AppDataSource extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?sslmode=verify-full"`
        }
      }
    });
  }

  async connect() {
    try {
      await this.$connect();
      console.log(`Connected to database: ${DB_DATABASE}`);
    }
    catch (err) {
      console.error(`Prisma failed to connect to database: ${DB_DATABASE}`, err);
    }
  }

  async disconnect() {
    try {
      await this.$disconnect();
      console.log(`Disconnected from database.`);
    }
    catch (err) {
      console.error(`Error closing prisma connection: ${DB_DATABASE}`, err);
    }
  }
}

export default new AppDataSource();