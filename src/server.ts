import {CorsOptions} from "cors";
import {config} from "./utility/config";
import express, {Application} from "express";
import Server from "./server.model";
import AppDataSource from "./utility/data-source";
import * as console from "console";

const static_path = __dirname + '/public';
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

export type TServerConfig = {
  port: number;
  corsOptions: CorsOptions;
  limiter: {
    time: number;
    max: number;
  }
}

const startServer = (configuration : TServerConfig) => {
  const app: Application = express();
  const server = new Server(app, configuration);

  process.on("SIGINT", async () => {
    await AppDataSource.connect();
    process.exit();
  });

  process.on("SIGTERM", async () => {
    await AppDataSource.disconnect();
    process.exit();
  });

  AppDataSource.connect()
      .then(async () => {

        app.listen(configuration.port, "localhost", () => {
          console.log(`Server listening on port ${configuration.port}`);
        }).on("error", (err: any) => {
          if (err.code === "EADDRINUSE") {
            console.log("ERROR: address already in use, retry...");
          }
          else {
            console.log(err);
          }
        }).on("close", async () => {
          await AppDataSource.$disconnect();
          console.log("Data source disconnected");
        });

        console.log("Data source initialized");
      })
      .catch(async (err) => {
        console.error("Error initializing data source", err);
        await AppDataSource.$disconnect()
        process.exit(1)
      });
}

startServer(config.server);