import {IRoutes} from "./index";
import {Router} from "express";
import AocDocumentController from "../controllers/aoc-document.controller";

class AocDocumentRoutes implements IRoutes {
  router = Router();
  controller = new AocDocumentController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/assign-care', this.controller.assignCare);
    this.router.get('/get-document', this.controller.getAuthorizationDocument);
    this.router.delete('/unassign-care', this.controller.unassignCare);
    this.router.get('/proteges/:caregiver_id', this.controller.getProteges);
    this.router.get('/caregivers/:elderly_id', this.controller.getCaregivers);
  }
}

export default new AocDocumentRoutes().router;