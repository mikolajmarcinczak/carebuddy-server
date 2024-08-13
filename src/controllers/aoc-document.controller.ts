import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";

export default class AocDocumentController {

  constructor() {
    this.assignCare = this.assignCare.bind(this);
    this.getAuthorizationDocument = this.getAuthorizationDocument.bind(this);
    this.unassignCare = this.unassignCare.bind(this);
  }

  async assignCare(req: Request, res: Response) {
    const {body} = req;
    const {elderly_id, caregiver_id, document_url} = body;

    try {
      const document = await AppDataSource.authorizationofcare.create({
        data: {
          elderly_id,
          caregiver_id,
          document_url
        }
      });
    }
    catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "authorization_of_care", error);
    }
  }

  async getAuthorizationDocument(req: Request, res: Response) {
    const {elderly_id, caregiver_id} = req.body;

    try {
      const document = await AppDataSource.authorizationofcare.findUnique({
        where: {
          elderly_id_caregiver_id: {
            elderly_id: elderly_id as string,
            caregiver_id: caregiver_id as string
          }
        }
      });
      if (!document) {
        return Errors.notFound(res, "authorization_of_care");
      }
      return res.status(200).send({message: "Authorization of Care document retrieved successfully", data: document.document_url});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "authorization_of_care", error);
    }
  }

  async unassignCare(req: Request, res: Response) {
    const {elderly_id, caregiver_id} = req.body;

    const document = await AppDataSource.authorizationofcare.findUnique({
      where: {
        elderly_id_caregiver_id: {
          elderly_id: elderly_id as string,
          caregiver_id: caregiver_id as string
        }
      }
    });

    if (!document) {
      return Errors.notFound(res, "authorization_of_care");
    }

    try {
      await AppDataSource.authorizationofcare.delete({
        where: {
          elderly_id_caregiver_id: {
            elderly_id: elderly_id as string,
            caregiver_id: caregiver_id as string
          }
        }
      });
      return res.status(200).send({message: "Document deleted successfully"});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotDelete(res, "authorization_of_care", error);
    }
  }
}