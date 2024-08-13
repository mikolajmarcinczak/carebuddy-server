import {Router} from "express";
import {IRoutes} from "./index";
import NoteController from "../controllers/note.controller";

class NoteRoutes implements IRoutes {
  router = Router();
  controller = new NoteController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/create', this.controller.createNote);
    this.router.delete('/remove/:id', this.controller.removeNote);
    this.router.put('/update/:id', this.controller.updateNote);
    this.router.get('/get/:id', this.controller.getSingleNote);
    this.router.get('/get-many/:userId', this.controller.getNotesByUser);
    this.router.put('/send/:userId', this.controller.sendNote);
  }
}

export default new NoteRoutes().router;