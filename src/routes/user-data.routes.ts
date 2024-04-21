import {IRoutes} from "./index";
import {Router} from "express";
import UserDataController from "../controllers/user-data.controller";

class UserDataRoutes implements IRoutes {
  router = Router();
  controller = new UserDataController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/elderly', this.controller.getElderlyAccountInfo);
    this.router.post('/elderly/add', this.controller.addElderlyAccountInfo);
    this.router.put('/elderly', this.controller.updateElderlyAccountInfo);
    this.router.get('/caregiver', this.controller.getCaregiverAccountInfo);
    this.router.post('/caregiver/add', this.controller.addCaregiverAccountInfo);
    this.router.put('/caregiver', this.controller.updateCaregiverAccountInfo);
  }
}

export default new UserDataRoutes().router;