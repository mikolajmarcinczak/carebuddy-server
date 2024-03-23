import {Router} from "express";
import {IRoutes} from "./index";
import UsersController from "../controllers/users.controller";

class UserRoutes implements IRoutes {
  router = Router();
  controller = new UsersController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/:role/all', this.controller.getUsersByRole);
    this.router.get('/', this.controller.getSingleUser);
    this.router.post('/add', this.controller.addSingleUser);
    this.router.put('/', this.controller.updateSingleUser);
    this.router.delete('/', this.controller.removeSingleUser);
  }
}

export default new UserRoutes().router;