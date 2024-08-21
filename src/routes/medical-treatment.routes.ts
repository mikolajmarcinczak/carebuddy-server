import {IRoutes} from "./index";
import {Router} from "express";
import MedicalTreatmentController from "../controllers/medical-treatment.controller";

class MedicalTreatmentRoutes implements IRoutes {
  router = Router();
  controller = new MedicalTreatmentController();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post('/', this.controller.addMedicalTreatment);
    this.router.get('/:id', this.controller.getTreatmentDetails);
    this.router.get('/get/:userId', this.controller.getMedicamentsForUser);
    this.router.get('/get-prescription/:userId/:id', this.controller.getPrescription);
    this.router.put('/:id', this.controller.updateMedicalTreatment);
    this.router.delete('/:id', this.controller.endMedicalTreatment);
  }

}

export default new MedicalTreatmentRoutes().router;