import express from "express";
import userRoutes from "./user.routes";
import homeRoutes from "./home.routes";
import authRoutes from "./auth.routes";

export interface IRoutes {
  router: express.Router;
  controller: object;
  initRoutes(): void;
}

export default class Routes {
  constructor(app: express.Application) {

    app.use("/api", homeRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/auth", authRoutes);
  }
}