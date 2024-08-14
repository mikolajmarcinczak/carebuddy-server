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
    const { id } = req.params;

    try {
      const medicament = await AppDataSource.medicamententity.findUnique({
        where: { id },
      });
      if (!medicament) {
        return Errors.notFound(res, "medicament");
      }
      return res.status(200).send({ message: "Medicament details retrieved successfully", data: medicament });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medicament", error);
    }
  }

  async getMedicamentsByManufacturer(req: Request, res: Response) {
    const { manufacturer } = req.params;

    try {
      const medicaments = await AppDataSource.medicamententity.findMany({
        where: { manufacturer },
      });
      if (!medicaments) {
        return Errors.notFound(res, "medicaments");
      }
      return res.status(200).send({ message: "Medicaments retrieved successfully", data: medicaments });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medicaments", error);
    }
  }

  async addMedicament(req: Request, res: Response) {
    const { name, dosage, manufacturer, active_substance, composition, contraindications, indications } = req.body;

    try {
      const medicament = await AppDataSource.medicamententity.create({
        data: {
          name,
          dosage,
          manufacturer,
          active_substance,
          composition,
          contraindications,
          indications,
        },
      });
      return res.status(201).send({ message: "Medicament created successfully", data: medicament });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "medicament", error);
    }
  }

  async modifyMedicament(req: Request, res: Response) {
    const { id } = req.params;
    const { name, dosage, manufacturer, active_substance, composition, contraindications, indications } = req.body;

    try {
      const medicament = await AppDataSource.medicamententity.update({
        where: { id },
        data: {
          name,
          dosage,
          manufacturer,
          active_substance,
          composition,
          contraindications,
          indications,
        },
      });
      return res.status(200).send({ message: "Medicament updated successfully", data: medicament });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, "medicament", error);
    }
  }

  async removeMedicament(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const medicament = await AppDataSource.medicamententity.delete({
        where: { id },
      });
      return res.status(200).send({ message: "Medicament removed successfully", data: medicament });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotDelete(res, "medicament", error);
    }
  }

  async calculateAppropriateDose(req: Request, res: Response) {
    const { id, weight, age } = req.body;

    try {
      const medicament = await AppDataSource.medicamententity.findUnique({
        where: { id },
      });
      if (!medicament) {
        return Errors.notFound(res, "medicament");
      }

      // calculate the appropriate dose based on weight and age
      const dose = this.calculateDose(medicament, weight, age);
      return res.status(200).send({ message: "Appropriate dose calculated successfully", data: { dose } });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medicament", error);
    }
  }

  private calculateDose(medicament: any, weight: number, age: number): number {
    // I
    return 0;
  }
}