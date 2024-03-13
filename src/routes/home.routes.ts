import {Router} from "express";
import {IRoutes} from "./index";

class HomeRoutes implements IRoutes {
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    //this.router.get('/', HomeController.welcome);
  }
}

export default new HomeRoutes().router;