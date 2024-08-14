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
    const { id } = req.params;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.findUnique({
        where: { id },
      });
      if (!treatment) {
        return Errors.notFound(res, "medical_treatment");
      }
      return res.status(200).send({ message: "Medical treatment retrieved successfully", data: treatment });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medical_treatment", error);
    }
  }

  async getMedicamentsForUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const treatments = await AppDataSource.medicaltreatmententity.findMany({
        where: { user_id: userId },
      });

      if (!treatments || treatments.length === 0) {
        return Errors.notFound(res, "medical_treatments");
      }

      const medicamentIds = treatments.flatMap(treatment => treatment.medicament_ids);
      const medicaments = await AppDataSource.medicamententity.findMany({
        where: { id: { in: medicamentIds } },
      });

      return res.status(200).send({ message: "Medicaments retrieved successfully", data: medicaments });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "medicaments", error);
    }
  }

  async addMedicalTreatment(req: Request, res: Response) {
    const { user_id, medicament_ids, diagnosis_date, diagnosis, treatment_plan, certificate_url, prescription_url } = req.body;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.create({
        data: {
          user_id,
          medicament_ids,
          diagnosis_date,
          diagnosis,
          treatment_plan,
          certificate_url,
          prescription_url,
        },
      });
      return res.status(201).send({ message: "Medical treatment created successfully", data: treatment });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "medical_treatment", error);
    }
  }

  async updateMedicalTreatment(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id, medicament_ids, diagnosis_date, diagnosis, treatment_plan, certificate_url, prescription_url } = req.body;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.update({
        where: { id },
        data: {
          user_id,
          medicament_ids,
          diagnosis_date,
          diagnosis,
          treatment_plan,
          certificate_url,
          prescription_url,
        },
      });
      return res.status(200).send({ message: "Medical treatment updated successfully", data: treatment });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, "medical_treatment", error);
    }
  }

  async endMedicalTreatment(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.delete({
        where: { id },
      });
      return res.status(200).send({ message: "Medical treatment removed successfully", data: treatment });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotDelete(res, "medical_treatment", error);
    }
  }

  async getPrescription(req: Request, res: Response) {
    const { id, userId } = req.params;

    try {
      const treatment = await AppDataSource.medicaltreatmententity.findUnique({
        where: { id, user_id: userId },
      });

      if (!treatment) {
        return Errors.notFound(res, "medical_treatment");
      }

      const medicamentIds = treatment.medicament_ids;
      const medicaments = await AppDataSource.medicamententity.findMany({
        where: { id: { in: medicamentIds } },
      });

      return res.status(200).send({
        message: "Prescription retrieved successfully",
        data: { medicaments, prescription_url: treatment.prescription_url },
      });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "prescription", error);
    }
  }
}