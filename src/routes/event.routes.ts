import {Router} from "express";
import {IRoutes} from "./index";
import EventController from "../controllers/event.controller";

class EventRoutes implements IRoutes {
  router = Router();
  controller = new EventController();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post('/', this.controller.addEvent);
    this.router.get('/:id', this.controller.getSingleEvent);
    this.router.get('/get-many/:userId', this.controller.getEventsByUser);
    this.router.put('/:id', this.controller.updateEvent);
    this.router.delete('/:id', this.controller.removeEvent);
  }
}

export default new EventRoutes().router;