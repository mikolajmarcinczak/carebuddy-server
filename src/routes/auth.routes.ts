import {IRoutes} from "./index";
import {Router} from "express";
import AuthController from "../controllers/auth.controller";

class AuthRoutes implements IRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/login', this.controller.login);
    this.router.post('/register', this.controller.register);
    this.router.post('/logout', this.controller.logout);
    this.router.post('/forgotPassword', this.controller.forgotPassword);
    this.router.post('/resetPassword/:token', this.controller.resetPassword);
  }
}

export default new AuthRoutes().router;