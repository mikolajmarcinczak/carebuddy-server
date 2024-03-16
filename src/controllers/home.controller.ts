import {Response} from "express";

export default class HomeController {
  static index(res: Response) {
    res.status(200).json({ message: "Welcome to CareBuddy" });
  }
}