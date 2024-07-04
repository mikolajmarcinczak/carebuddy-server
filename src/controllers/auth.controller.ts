import {Request, Response} from "express";
import {validationResult} from "express-validator";
import {UserDTO} from "../dto/user.dto";
import {Errors} from "../utility/dberrors";
import {generateToken} from "../utility/generate.token";
import {assertIsError} from "../utility/error.guard";

import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import * as process from "process";

import AppDataSource from "../utility/data-source";
import MailService from "../services/mail.service";
import HtmlProcessingService from "../services/html-processing.service";

const RETRY_TIMER = 5
const RESET_TOKEN_BYTES = 16

export default class AuthController {
  emailService = MailService;
  messageProcessingService = HtmlProcessingService;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.sendResetTokenEmail = this.sendResetTokenEmail.bind(this);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await AppDataSource.users.findUnique({
        where: {
          email: email as string,
        },
        select: {
          username: true,
          password: true,
          role: true,
          user_id: true,
          retry: true,
          retryExp: true
        }
      });

      const pass = await argon2.verify(user?.password as string, password as string);
      const retryCount = Number(user?.retry);
      const userData = new UserDTO(user.username, email, user.role);

      if (pass && retryCount <= 3) {
        let token: string;
        jwt.sign(
            {id: user.user_id},
            process.env.JWT_SECRET as string,
            {expiresIn: '3600'},
            (err, jwtToken) => {
              token = jwtToken;
              if (err) {
                assertIsError(err);
                return Errors.couldNotCreate(res, 'auth', err);
              }
            });

        //update user retry count
        await AppDataSource.users.update({
          where: {
            user_id: user.user_id
          },
          data: {
            retry: 0,
            retryExp: 0
          }
        });

        console.log(token);
        userData['accessToken'] = token;

        res.cookie('accessToken', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 8 * 3600000),
          path: '/'
        });
        return res.status(200).send({message: 'Logged in successfully', token: token, data: userData});
      }
      else {
        if (user) {

          switch (user.retry) {
            case 3:
              if (BigInt(user.retryExp) > BigInt(Date.now()).valueOf()) {
                return res.send({
                  message: "Your account is still locked. Please contact support to unlock your account",
                  now: new Date(Date.now()).valueOf(),
                  exp: Number(user.retryExp)
                })
              }
              else {
                await AppDataSource.users.update({
                  where: {
                    email: email as string,
                    user_id: user.user_id
                  },
                  data: {
                    retry: 1,
                  }
                })
                return res.send({
                  message: "Your account is unlocked",
                  now: new Date(Date.now()).valueOf(),
                  exp: Number(user.retryExp)
                })
              }
            case 2:
              await AppDataSource.users.update({
                where: {
                  email: email as string,
                  user_id: user.user_id
                },
                data: {
                  retry: {
                    increment: 1
                  },
                  retryExp: new Date(Date.now() + RETRY_TIMER * 60000).valueOf()
                }
              })
              return res.send({
                message: `Your account has been locked for ${RETRY_TIMER} minute(s). Please try again later`
              })
            default:
              await AppDataSource.users.update({
                where: {
                  email: email as string,
                  user_id: user.user_id
                },
                data: {
                  retry: {
                    increment: 1
                  }
                }
              })
              return res.send({
                message: "Password is wrong, please try again. "
              })
          }
        }
        else {
          res.send({
            message: "There is no account with that email address. Please try again."
          })
          return res.redirect(302, '/login')
        }
      }
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'auth', error);
    }
  }

  logout(req: Request, res: Response) {
    res.clearCookie('accessToken', {path: '/'});
    return res.status(200).send({message: 'Logged out successfully'});
  }

  async register(req: Request, res: Response) {
    const userBody = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: 'Errors found during validation', errors: errors.array()});
    }

    try {
      const hashedPw = await argon2.hash(req.body.password);
      const newUser = await AppDataSource.users.create({
        data: {
          username: userBody.username,
          password: hashedPw,
          role: userBody.role,
          email: userBody.email
        }
      });
      const userData = new UserDTO(newUser.username, newUser.email, newUser.role);

      let token: string;
      jwt.sign(
          {user_id: newUser.user_id},
          process.env.JWT_SECRET as string,
          {expiresIn: '3600'},
          (err, jwtToken) => {
            token = jwtToken;
            if (err) {
              assertIsError(err);
              return Errors.couldNotCreate(res, 'auth', err);
            }
          });

      console.log('register token:' + token);

      res.cookie('accessToken', token, {httpOnly: true, secure: true, path: '/'});
      return res.status(200).send({message: `User '${userData.username}' created successfully`, data: userData, token: token});
    } catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotCreate(res, 'auth', error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const user = await AppDataSource.users.findUnique({
        where: {
          email: req.body.email
        }
      });

      if (user != null) {
        const token = await generateToken(RESET_TOKEN_BYTES);
        const resetToken = await AppDataSource.users.update({
          where: {
            email: req.body.email
          },
          data: {
            resetPass: token,
            resetExp: new Date((Date.now() + RETRY_TIMER * 60000) / 1000).valueOf()
          }
        });

        await this.sendResetTokenEmail(user.email, user.username, token);

        return res.json({
          message: `Reset token has been sent to ${user.email}`,
          resetToken: resetToken
        })
      }
      else {
        return Errors.notFound(res.json({
          reason: `Account with email address: ${req.body.email} does not exist`
        }), 'auth');
      }
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'auth', error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const user = await AppDataSource.users.findUnique({
        where: {
          resetPass: req.params.token
        }
      });

      if (user?.resetExp) {
        if (user.resetExp  > new Date(Date.now() / 1000).valueOf()) {
          const hashedPw = await argon2.hash(req.body.password);
          const resetToken = await AppDataSource.users.update({
            where: {
              email: user.email
            },
            data: {
              password: hashedPw,
              resetPass: "",
              resetExp: 0
            }
          });

          return res.status(200).send({message: `Password for '${user.username} has been changed`, data: user.username});
        }
        else {
          return Errors.couldNotUpdate(res, 'auth', new Error('Reset token has expired'));
        }
      }
      else {
        return res.json({message: `Looks like you are trying to reset your password. You will be redirected...`}).redirect(302, '/forgot-password');
      }
    }
    catch (error: unknown) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, 'auth', error);
    }
  }

  async sendResetTokenEmail(email: string, username: string, token: string) {
    let html = await this.messageProcessingService.generateResetPasswordMessage(username, token);
    await this.emailService.sendMail(process.env["MAIL_USERNAME "], email, "Your access token", html);
  }
}