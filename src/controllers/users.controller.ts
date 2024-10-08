import {Request, Response} from "express";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import AppDataSource from "../utility/data-source";
import {replacer} from "../utility/json.replacer";

export default class UsersController {
  constructor() {
    this.getSingleUser = this.getSingleUser.bind(this);
    this.getUsersByRole = this.getUsersByRole.bind(this);
    this.addSingleUser = this.addSingleUser.bind(this);
    this.updateSingleUser = this.updateSingleUser.bind(this);
    this.removeSingleUser = this.removeSingleUser.bind(this);
  }

  //region Get
  async getSingleUser(req: Request, res: Response) {
    const identifier = req.query.identifier as string;

    if (identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.findUnique({
          where: {
            email: identifier
          }
        });
      }
      else {
        user = await AppDataSource.users.findUnique({
          where: {
            user_id: JSON.parse(JSON.stringify(identifier, replacer))
          }
        });
      }

      let userData = JSON.parse(JSON.stringify(user, replacer));

      if (!user) {
        return Errors.notFound(res, 'users');
      }
      return res.status(200).send({message: `User '${userData.username}' retrieved successfully`, data: userData});
    }
    catch (error: unknown) {
     assertIsError(error);
     return Errors.couldNotRetrieve(res, 'users', error);
    }
  }

  async getUsersByRole(req: Request, res: Response) {
    const role = req.params.role as string;

    if (role === "" || role === undefined || role === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      if (role === "0000") {
        const users = await AppDataSource.users.findMany();
        let usersData = users.map(user => JSON.parse(JSON.stringify(user, replacer)));
        return res.status(200).send({message: `All users retrieved successfully`, data: usersData});
      }
      const users = await AppDataSource.users.findMany({
        where: {
          role: role
        },
        include: {
          caregiveraccountinfo: true,
          elderlyaccountinfo: true
        }
      });

      let usersData = users.map(user => JSON.parse(JSON.stringify(user, replacer)));
      return res.status(200).send({message: `Users with role '${role}' retrieved successfully`, data: usersData});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'users', error);
    }
  }
  //endregion

  async addSingleUser(req: Request, res: Response) {
    const userBody = req.body;

    if (!userBody || Object.keys(userBody).length === 0){
      return Errors.badRequest(res, 'users');
    }

    try {
      const user = await AppDataSource.users.create({
        data: userBody
      });
      return res.status(200).send({message: `User '${user.username}' created successfully`, data: user});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotCreate(res, 'users', error);
    }
  }

  async updateSingleUser(req: Request, res: Response) {
    const userBody = req.body;
    const identifier = req.query.identifier as string;

    if (Object.keys(userBody).length === 0 || identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.update({
          where: {
            email: identifier
          },
          data: userBody
        });
      }
      else {
        user = await AppDataSource.users.update({
          where: {
            user_id: identifier
          },
          data: userBody
        });
      }

      if (!user) {
        return Errors.notFound(res, 'users');
      }
      return res.status(200).send({message: `User '${user.username}' updated successfully`, data: user});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, 'users', error);
    }
  }

  async removeSingleUser(req: Request, res: Response) {
    const identifier = req.query.identifier as string;

    if (identifier === "" || identifier === undefined || identifier === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      let user;
      if (identifier.includes('@')) {
        user = await AppDataSource.users.findUnique({
          where: {
            email: identifier
          },
          include: {
            caregiveraccountinfo: true,
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
            caregiveraccountinfo: true,
            elderlyaccountinfo: true
          }
        });
      }

      if (!user) {
        return Errors.notFound(res, 'users');
      }

      if (user.caregiveraccountinfo) {
        await AppDataSource.caregiveraccountinfo.delete({
          where: {
            user_id: user.user_id
          }
        });
      }

      if (user.elderlyaccountinfo) {
        await AppDataSource.elderlyaccountinfo.delete({
          where: {
            user_id: user.user_id
          }
        });
      }

      const deletedUser = await AppDataSource.users.delete({
        where: {
          user_id: user.user_id
        }
      });

      return res.status(200).send({message: `User '${user.username}' deleted successfully`, data: deletedUser});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotDelete(res, 'users', error);
    }
  }

}