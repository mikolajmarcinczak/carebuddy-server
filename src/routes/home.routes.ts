import {Router} from "express";
import {IRoutes} from "./index";
import HomeController from "../controllers/home.controller";

class HomeRoutes implements IRoutes {
  router = Router();
  controller = HomeController;

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/', this.controller.index);
  }
}

export default new HomeRoutes().router;