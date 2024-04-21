import express from "express";
import userRoutes from "./user.routes";
import homeRoutes from "./home.routes";
import authRoutes from "./auth.routes";
import userDataRoutes from "./user-data.routes";

export interface IRoutes {
  router: express.Router;
  controller: object;
  initRoutes(): void;
}

export default class Routes {
  constructor(app: express.Application) {
    let aggregateUserRoutes = express.Router();
    aggregateUserRoutes.use(userRoutes);
    aggregateUserRoutes.use(userDataRoutes);

    app.use("/api", homeRoutes);
    app.use("/api/user", aggregateUserRoutes);
    app.use("/api/auth", authRoutes);
  }
}