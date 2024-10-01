import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {replacer} from "../utility/json.replacer";

export default class AocDocumentController {

  constructor() {
    this.assignCare = this.assignCare.bind(this);
    this.getAuthorizationDocument = this.getAuthorizationDocument.bind(this);
    this.unassignCare = this.unassignCare.bind(this);
    this.getProteges = this.getProteges.bind(this);
    this.getCaregivers = this.getCaregivers.bind(this);
  }

  async assignCare(req: Request, res: Response) {
    const { elderly_id, caregiver_id, document_url } = req.body;

    if (!elderly_id || !caregiver_id) {
      return res.status(400).send({ message: 'Both elderly_id and caregiver_id are required' });
    }

    try {
      const elderlyExists = await AppDataSource.elderlyaccountinfo.findUnique({
        where: { user_id: elderly_id as string }
      });
      console.log(elderlyExists);
      if (!elderlyExists) {
        return res.status(404).send({ message: "Elderly not found" });
      }

      const caregiverExists = await AppDataSource.caregiveraccountinfo.findUnique({
        where: { user_id: caregiver_id as string }
      });
      console.log(caregiverExists);
      if (!caregiverExists) {
        return res.status(404).send({ message: "Caregiver not found" });
      }

      const document = await AppDataSource.authorizationofcare.create({
        data: {
          elderly_id: elderly_id,
          caregiver_id: caregiver_id,
          document_url: document_url
        }
      });

      return res.status(200).send({message: "Assignment of Care completed successfully", data: document.document_url});
    }
    catch (error: any) {
      assertIsError(error);
      if (error instanceof PrismaClientKnownRequestError) {
        error = error as PrismaClientKnownRequestError;
        if (error.code === 'P2002' && error.meta.target?.includes('elderly_id') && error.meta?.target?.includes('caregiver_id')) {
          return res.status(409).send({message: "This care assignment already exists."});
        }
      }
      return Errors.couldNotCreate(res, "authorization_of_care", error);
    }
  }

  async getAuthorizationDocument(req: Request, res: Response) {
    const {elderly_id, caregiver_id} = req.body;

    if (!elderly_id || !caregiver_id) {
      return res.status(400).send({ message: 'Both elderly_id and caregiver_id are required' });
    }

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

    if (!elderly_id || !caregiver_id) {
      return res.status(400).send({ message: 'Both elderly_id and caregiver_id are required' });
    }

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

  async getProteges(req: Request, res: Response) {
    const caregiver_id = req.params.caregiver_id as string;

    if (!caregiver_id) {
      return Errors.badRequest(res, "authorization_of_care");
    }

    try {
      const proteges = await AppDataSource.authorizationofcare.findMany({
        where: {
          caregiver_id: caregiver_id
        },
        include: {
          elderlyaccountinfo: {
            include: {
              users: true
            }
          }
        }
      });

      if (!proteges) {
        return Errors.notFound(res, "authorization_of_care");
      }

      const protegeList = proteges.map(protege => {
        const user = protege.elderlyaccountinfo.users;
        const accountInfo = protege.elderlyaccountinfo;
        delete accountInfo.users;
        return {
          ...JSON.parse(JSON.stringify(user, replacer)),
          elderlyaccountinfo: JSON.parse(JSON.stringify(accountInfo, replacer))
        };
      });

      return res.status(200).send({message: "Proteges retrieved successfully", data: protegeList});
    } catch(error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "authorization_of_care", error);
    }
  }

  async getCaregivers(req: Request, res: Response) {
    const elderly_id = req.params.elderly_id as string;

    if (!elderly_id) {
      return Errors.badRequest(res, "authorization_of_care");
    }

    try {
      const caregivers = await AppDataSource.authorizationofcare.findMany({
        where: {
          elderly_id: elderly_id
        },
        include: {
          caregiveraccountinfo: {
            include: {
              users: true
            }
          }
        }
      });

      if (!caregivers) {
        return Errors.notFound(res, "authorization_of_care");
      }

      const caregiverList = caregivers.map(caregiver => {
        const user = caregiver.caregiveraccountinfo.users;
        const accountInfo = caregiver.caregiveraccountinfo;
        delete accountInfo.users;
        return {
          ...JSON.parse(JSON.stringify(user, replacer)),
          caregiveraccountinfo: JSON.parse(JSON.stringify(accountInfo, replacer))
        };
      });

      return res.status(200).send({message: "Caregivers retrieved successfully", data: caregiverList});
    } catch(error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "authorization_of_care", error);
    }
  }
}