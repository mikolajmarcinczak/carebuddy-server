import {Router} from "express";
import MedicamentController from "../controllers/medicament.controller";

class MedicamentRoutes {
  public router: Router = Router();
  controller = new MedicamentController();


  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get('/single/:id', this.controller.getMedicamentDetails);
    this.router.get('/calculate', this.controller.calculateAppropriateDose);
    this.router.get('/get/:manufacturer', this.controller.getMedicamentsByManufacturer);
    this.router.get('/getAll', this.controller.getAllMedicaments);
    this.router.post('/', this.controller.addMedicament);
    this.router.put('/:id', this.controller.modifyMedicament);
    this.router.delete('/:id', this.controller.removeMedicament);
  }
}

export default new MedicamentRoutes().router;