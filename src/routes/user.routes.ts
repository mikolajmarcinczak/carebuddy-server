import {Router} from "express";
import {IRoutes} from "./index";

class UserRoutes implements IRoutes {
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    //this.router.get('/', UsersController.login);
  }
}

export default new UserRoutes().router;