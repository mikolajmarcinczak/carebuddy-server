import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";

export default class MedicamentController {
  constructor() {
    this.getMedicamentDetails = this.getMedicamentDetails.bind(this);
    this.calculateAppropriateDose = this.calculateAppropriateDose.bind(this);
    this.getMedicamentsByManufacturer = this.getMedicamentsByManufacturer.bind(this);
    this.addMedicament = this.addMedicament.bind(this);
    this.modifyMedicament = this.modifyMedicament.bind(this);
    this.removeMedicament = this.removeMedicament.bind(this);
  }

  async getMedicamentDetails(req: Request, res: Response) {
    // Get medicament details
  }

  async calculateAppropriateDose(req: Request, res: Response) {
    // Calculate appropriate dose
  }

  async getMedicamentsByManufacturer(req: Request, res: Response) {
    // Get medicaments by manufacturer
  }

  async addMedicament(req: Request, res: Response) {
    // Add medicament
  }

  async modifyMedicament(req: Request, res: Response) {
    // Modify medicament
  }

  async removeMedicament(req: Request, res: Response) {
    // Remove medicament
  }

}