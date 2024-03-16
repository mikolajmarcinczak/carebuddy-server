import {Request, Response} from "express";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import AppDataSource from "../utility/data-source";

export default class UsersController {

  //region Get
  async getSingleUser(req: Request, res: Response) {
    const id = req.params.id as string;

    if (id === "" || id === undefined || id === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      const user = await AppDataSource.users.findUnique({
        where: {
          user_id: id
        }
      });
      if (!user) {
        return Errors.notFound(res, 'users');
      }
      return res.status(200).send({message: `User '${user.username} retrieved successfully`, user: user});
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
      const users = await AppDataSource.users.findMany({
        where: {
          role: role
        }
      });
      res.status(200).send({message: `Users with role '${role}' retrieved successfully`, users: users});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'users', error);
    }
  }
  //endregion

  async addSingleUser(req: Request, res: Response) {
    const userBody = req.body;

    if (!userBody) {
      return Errors.badRequest(res, 'users');
    }

    try {
      const user = await AppDataSource.users.create({
        data: userBody
      });
      return res.status(200).send({message: `User '${user.username}' created successfully`, user: user});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotCreate(res, 'users', error);
    }
  }

  async updateSingleUser(req: Request, res: Response) {
    const userBody = req.body;
    const id = req.params.id as string;

    if (Object.keys(userBody).length === 0 || id === "" || id === undefined || id === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      const user = await AppDataSource.users.update({
        where: {
          user_id: id
        },
        data: userBody
      });
      return res.status(200).send({message: `User '${user.username}' updated successfully`, user: user});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, 'users', error);
    }
  }

  async removeSingleUser(req: Request, res: Response) {
    const id = req.params.id as string;

    if (id === "" || id === undefined || id === null) {
      return Errors.badRequest(res, 'users');
    }

    try {
      const user = await AppDataSource.users.findUnique({
        where: {
          user_id: id
        }
      });
      if (!user) {
        return Errors.notFound(res, 'users');
      }

      const deletedUser = await AppDataSource.users.delete({
        where: {
          user_id: id
        }
      });
      return res.status(200).send({message: `User '${user.username}' deleted successfully`, user: deletedUser});
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotDelete(res, 'users', error);
    }
  }

}