import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";

export default class MedicalTreatmentController {

  constructor() {
    this.getTreatmentDetails = this.getTreatmentDetails.bind(this);
    this.getMedicamentsForUser = this.getMedicamentsForUser.bind(this);
    this.addMedicalTreatment = this.addMedicalTreatment.bind(this);
    this.updateMedicalTreatment = this.updateMedicalTreatment.bind(this);
    this.endMedicalTreatment = this.endMedicalTreatment.bind(this);
    this.getPrescription = this.getPrescription.bind(this);
  }

  async getTreatmentDetails(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.findUnique({
        where: {
          id: id as string
        }
      });
      if (!treatment) {
        return Errors.notFound(res, "medical_treatment");
      }
      return res.status(200).send({message: "Medical treatment details retrieved successfully", data: treatment});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medical_treatment", error);
    }
  }

  async getMedicamentsForUser(req: Request, res: Response) {
    const {userId} = req.params;

    try {
      const medicaments = await AppDataSource.medicaltreatmententity.findMany({
        where: {
          user_id: userId as string
        }
      });
      if (!medicaments) {
        return Errors.notFound(res, "medicaments");
      }
      return res.status(200).send({message: "Medicaments retrieved successfully", data: medicaments});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medicaments", error);
    }
  }

  async addMedicalTreatment(req: Request, res: Response) {
    const {body} = req;
    const {user_id, medicament_id, start_date, end_date} = body;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.create({
        data: {
          user_id,
          medicament_id,
          start_date,
          end_date
        }
      });
      return res.status(201).send({message: "Medical treatment added successfully", data: treatment});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "medical_treatment", error);
    }
  }

  async updateMedicalTreatment(req: Request, res: Response) {
    const {id} = req.params;
    const {body} = req;
    const {user_id, medicament_ids, start_date, end_date} = body;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.update({
        where: {
          id: id as string
        },
        data: {
          user_id,
          medicament_ids,
          start_date,
          end_date
        }
      });
      return res.status(200).send({message: "Medical treatment updated successfully", data: treatment});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, "medical_treatment", error);
    }
  }

  async endMedicalTreatment(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.update({
        where: {
          id: id as string
        },
        data: {
          end_date: new Date()
        }
      });
      return res.status(200).send({message: "Medical treatment ended successfully", data: treatment});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, "medical_treatment", error);
    }
  }

  async getPrescription(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.findUnique({
        where: {
          id: id as string
        }
      });
      if (!treatment) {
        return Errors.notFound(res, "medical_treatment");
      }
      const medicament = await AppDataSource.medicamententity.findUnique({
        where: {
          id: treatment.medicament_ids
        }
      });
      if (!medicament) {
        return Errors.notFound(res, "medicament");
      }
      return res.status(200).send({message: "Prescription retrieved successfully", data: medicament});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "prescription", error);
    }
  }
}