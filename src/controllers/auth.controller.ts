import { Request, Response } from "express";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import AppDataSource from "../utility/data-source";
import {validationResult} from "express-validator";

export default class AuthController {
  async login(req: Request, res: Response) {
    const userBody = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await AppDataSource.users.findUnique({
        where: {
          user_id: userBody.user_id
        },
        select: {
          username: true,
          password: true,
          role: true,
          user_id: true,
        }
      });

      if (!user) {
        res.redirect(302, '/login');
        return Errors.notFound(res, 'auth');
      }

      const pass = await argon2.verify(user?.password, userBody.password);
      const retryCount = 0; //Number(user?.retry);

      if (pass && retryCount <= 3) {
        var token = jwt.sign(
            {user_id: user.user_id},
            process.env.JWT_SECRET as string,
            {expiresIn: '3600'},
            (err, jwtToken) => {
              if (err) {
                assertIsError(err);
                return Errors.couldNotCreate(res, 'auth', err);
              }
              return jwtToken;
            });

        //update user retry count

        await res.cookie('accessToken', token, {httpOnly: true, secure: true, sameSite: 'none', path: '/'});
      }
    }
    catch (error: unknown) {
      assertIsError(error);
      Errors.couldNotRetrieve(res, 'auth', error);
    }
  }

  async logout(req: Request, res: Response) {

  }

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const hashedPw = await argon2.hash(req.body.password);
      const newUser = await AppDataSource.users.create({
        data: {
          username: req.body.username,
          password: hashedPw,
          role: req.body.role,
          email: req.body.email
        }
      });
      res.status(200).send({message: `User '${newUser.username}' created successfully`, user: newUser});

      var token = jwt.sign(
          {user_id: newUser.user_id},
          process.env.JWT_SECRET as string,
          {expiresIn: '3600'},
          (err, jwtToken) => {
            if (err) {
              assertIsError(err);
              return Errors.couldNotCreate(res, 'auth', err);
            }
            return jwtToken;

          });

      await res.cookie('accessToken', token, {httpOnly: true, secure: true, sameSite: 'none', path: '/'});
    } catch (error: unknown) {
      assertIsError(error);
      Errors.couldNotCreate(res, 'auth', error);
    }
  }

  async forgotPassword(req: Request, res: Response) {

  }

  async resetPassword(req: Request, res: Response) {

  }
}