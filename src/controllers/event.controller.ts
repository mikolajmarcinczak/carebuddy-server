import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";

export default class EventController {

  constructor() {
    this.addEvent = this.addEvent.bind(this);
    this.getSingleEvent = this.getSingleEvent.bind(this);
    this.getEventsByUser = this.getEventsByUser.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
  }

  async addEvent(req: Request, res: Response) {
    const {body} = req;
    const {user_id, event_name, event_description, event_date} = body;

    try {
      const event = await AppDataSource.event.create({
        data: {
          user_id,
          event_name,
          event_description,
          event_date
        }
      });
      return res.status(201).send({message: "Event created successfully", data: event});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "event", error);
    }
  }

  async getSingleEvent(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const event = await AppDataSource.event.findUnique({
        where: {
          id: id as string
        }
      });
      if (!event) {
        return Errors.notFound(res, "event");
      }
      return res.status(200).send({message: "Event retrieved successfully", data: event});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "event", error);
    }
  }

  async getEventsByUser(req: Request, res: Response) {
    const {userId} = req.params;

    try {
      const events = await AppDataSource.event.findMany({
        where: {
          user_id: userId as string
        }
      });
      if (!events) {
        return Errors.notFound(res, "events");
      }
      return res.status(200).send({message: "Events retrieved successfully", data: events});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "events", error);
    }
  }

  async updateEvent(req: Request, res: Response) {
    const {body} = req;
    const {id, event_name, event_description, event_date} = body;

    try {
      const event = await AppDataSource.event.update({
        where: {
          id: id as string
        },
        data: {
          event_name,
          event_description,
          event_date
        }
      });
      return res.status(200).send({message: "Event updated successfully", data: event});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, "event", error);
    }
  }

  async removeEvent(req: Request, res: Response) {
    const {id} = req.params;

    try {
      const event = await AppDataSource.event.delete({
        where: {
          id: id as string
        }
      });
      return res.status(200).send({message: "Event deleted successfully", data: event});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotDelete(res, "event", error);
    }
  }
}