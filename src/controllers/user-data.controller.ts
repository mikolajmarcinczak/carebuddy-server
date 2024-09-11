import {Request, Response} from "express";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import AppDataSource from "../utility/data-source";
import {replacer} from "../utility/json.replacer";
import {filterUndefinedFields} from "../utility/undefined-fields.filter";

export default class UserDataController {
  async getElderlyAccountInfo(req: Request, res: Response) {
    const identifier = req.query.identifier as string;

    if (identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'usersData');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.findUnique({
          where: {
            email: identifier
          },
          include: {
            elderlyaccountinfo: true
          }
        });
      }
      else {
        user = await AppDataSource.users.findUnique({
          where: {
            user_id: identifier
          },
          include: {
            elderlyaccountinfo: true
          }
        });
      }

      let userData = JSON.parse(JSON.stringify(user, replacer));

      if (!user && !user.elderlyaccountinfo) {
        return Errors.notFound(res, 'usersData');
      }
      return res.status(200).send({message: `Data for user '${userData.username}' retrieved successfully`, data: userData});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'usersData', error);
    }
  }

  async addElderlyAccountInfo(req: Request, res: Response) {
    const userBody = req.body;

    if (!userBody || Object.keys(userBody).length === 0) {
      return Errors.badRequest(res, 'usersData');
    }

    try {
      let user;
      user = await AppDataSource.users.findUnique({
        where: {
          email: userBody.user.email
        }
      });

      if (!user) {
        return Errors.notFound(res, 'usersData');
      }

      delete userBody.user.email;
      let user_id = user.user_id;

      const accountInfo = await AppDataSource.elderlyaccountinfo.create({
        data: {
          phone_number: userBody.phone_number,
          address: userBody.address,
          city: userBody.city,
          date_of_birth: new Date(userBody.date_of_birth),
          about_me: userBody.about_me,
          height: userBody.height,
          weight: userBody.weight,
          emergency_number: userBody.emergency_number,
          user_id: user_id
        }
      });

      if (accountInfo) {
        await AppDataSource.users.update({
          where: {
            user_id: user_id
          },
          data: {
            username: userBody.username,
            elderlyaccountinfo: {
              connect: {
                user_id: user_id
              }
            }
          }
        });
      }

      return res.status(201).send({message: `Data for user '${user.username}' created successfully`, data: accountInfo});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotCreate(res, 'usersData', error);
    }
  }

  async updateElderlyAccountInfo(req: Request, res: Response) {
    const userBody = req.body;
    const identifier = req.query.identifier as string;

    if (Object.keys(userBody).length === 0 || identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'usersData');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.findUnique({
          where: {
            email: identifier
          },
          include: {
            elderlyaccountinfo: true
          }
        });
      }
      else {
        user = await AppDataSource.users.findUnique({
          where: {
            user_id: identifier
          },
          include: {
            elderlyaccountinfo: true
          }
        });
      }

      if (!user || !user.elderlyaccountinfo) {
        return Errors.notFound(res, 'usersData');
      }

      const updateData = filterUndefinedFields(userBody);
      delete updateData.user;
      if (updateData.date_of_birth) {
        updateData.date_of_birth = new Date(updateData.date_of_birth);
      }

      const accountInfo = await AppDataSource.elderlyaccountinfo.update({
        where: {
          user_id: user.user_id
        },
        data: updateData
      });

      if (accountInfo) {
        await AppDataSource.users.update({
          where: {
            user_id: user.user_id
          },
          data: {
            username: userBody.user.username,
            elderlyaccountinfo: {
              connect: {
                user_id: user.user_id
              }
            }
          }
        });
      }

      return res.status(200).send({message: `Data for user '${user.username}' updated successfully`, data: accountInfo});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, 'usersData', error);
    }
  }

  async getCaregiverAccountInfo(req: Request, res: Response) {
    const identifier = req.query.identifier as string;

    if (identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'usersData');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.findUnique({
          where: {
            email: identifier
          },
          include: {
            caregiveraccountinfo: true
          }
        });
      } else {
        user = await AppDataSource.users.findUnique({
          where: {
            user_id: identifier
          },
          include: {
            caregiveraccountinfo: true
          }
        });
      }

      let userData = JSON.parse(JSON.stringify(user, replacer));

      if (!user && !user.caregiveraccountinfo) {
        return Errors.notFound(res, 'usersData');
      }
      return res.status(200).send({message: `Data for user '${userData.username}' retrieved successfully`, data: userData});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'usersData', error);
    }
  }

  async addCaregiverAccountInfo(req: Request, res: Response) {
    const userBody = req.body;

    if (!userBody || Object.keys(userBody).length === 0){
      return Errors.badRequest(res, 'usersData');
    }

    try {
      let user;
      user = await AppDataSource.users.findUnique({
        where: {
          email: userBody.user.email
        }
      });

      if (!user) {
        return Errors.notFound(res, 'user for usersData');
      }

      delete userBody.user.email;
      let user_id = user.user_id;

      const accountInfo = await AppDataSource.caregiveraccountinfo.create({
        data: {
          phone_number: userBody.phone_number,
          city: userBody.city,
          date_of_birth: new Date(userBody.date_of_birth),
          about_me: userBody.about_me,
          user_id: user_id
        }
      });

      if (accountInfo) {
        await AppDataSource.users.update({
          where: {
            user_id: user_id
          },
          data: {
            username: userBody.user.username,
            caregiveraccountinfo: {
              connect: {
                user_id: user_id
              }
            }
          }
        });
      }

      return res.status(201).send({message: `Data for user '${user.username}' created successfully`, data: accountInfo});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotCreate(res, 'usersData', error);
    }
  }

  async updateCaregiverAccountInfo(req: Request, res: Response) {
    const userBody = req.body;
    const identifier = req.query.identifier as string;

    if (Object.keys(userBody).length === 0 || identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'usersData');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.findUnique({
          where: {
            email: identifier
          },
          include: {
            caregiveraccountinfo: true
          }
        });
      }
      else {
        user = await AppDataSource.users.findUnique({
          where: {
            user_id: identifier
          },
          include: {
            caregiveraccountinfo: true
          }
        });
      }

      if (!user || !user.caregiveraccountinfo) {
        return Errors.notFound(res, 'usersData');
      }

      const updateData = filterUndefinedFields(userBody);
      delete updateData.user;
      if (updateData.date_of_birth) {
        updateData.date_of_birth = new Date(updateData.date_of_birth);
      }

      const accountInfo = await AppDataSource.caregiveraccountinfo.update({
        where: {
          user_id: user.user_id
        },
        data: updateData
      });

      if (accountInfo) {
        await AppDataSource.users.update({
          where: {
            user_id: user.user_id
          },
          data: {
            username: userBody.username,
            caregiveraccountinfo: {
              connect: {
                user_id: user.user_id
              }
            }
          }
        });
      }

      return res.status(200).send({message: `Data for user '${user.username}' updated successfully`, data: accountInfo});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, 'usersData', error);
    }
  }

}