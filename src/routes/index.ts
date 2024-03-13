import express from "express";
import userRoutes from "./user.routes";
import homeRoutes from "./home.routes";

export interface IRoutes {
  router: express.Router;
  initRoutes(): void;
}

export default class Routes {
  constructor(app: express.Application) {

    app.use("/api", homeRoutes);
    app.use("/api/auth", userRoutes);
  }
}