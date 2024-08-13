import express from "express";
import userRoutes from "./user.routes";
import homeRoutes from "./home.routes";
import authRoutes from "./auth.routes";
import userDataRoutes from "./user-data.routes";
import aocDocumentRoutes from "./aoc-document.routes";
import noteRoutes from "./note.routes";
import medicamentRoutes from "./medicament.routes";
import medicalTreatmentRoutes from "./medical-treatment.routes";
import eventRoutes from "./event.routes";

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
    app.use("/api/aoc-document", aocDocumentRoutes);
    app.use("/api/note", noteRoutes);
    app.use("/api/medicament", medicamentRoutes);
    app.use("/api/medical-treatment", medicalTreatmentRoutes);
    app.use("api/event", eventRoutes);

  }
}