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
    const {user_ids, time, location, description, title, recurring } = req.body;

    try {
      const formattedUserIds = user_ids.map((id: string) => {
        if (id.length !== 36) {
          throw new Error(`Invalid UUID format for user_id: ${id}`);
        }
        return id;
      })

      if (!user_ids || !Array.isArray(user_ids)) {
        return res.status(400).json({ error: 'user_ids must be a defined array' });
      }

      const event = await AppDataSource.event.create({
        data: {
          user_ids: formattedUserIds,
          time: new Date(time),
          location,
          description,
          title,
          recurring
        }
      });
      return res.status(201).send({message: "Event created successfully", data: event});
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "event", error);
    }
  }

  async getSingleEvent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const event = await AppDataSource.event.findUnique({
        where: { id },
        include: { alarm: true },
      });
      if (!event) {
        return Errors.notFound(res, 'event');
      }
      return res.status(200).send({ message: 'Event retrieved successfully', data: event });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'event', error);
    }
  }

  async getEventsByUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const events = await AppDataSource.event.findMany({
        where: { user_ids: { has: userId } },
        include: { alarm: true },
      });
      if (!events) {
        return Errors.notFound(res, 'events');
      }
      return res.status(200).send({ message: 'Events retrieved successfully', data: events });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, 'events', error);
    }
  }

  async updateEvent(req: Request, res: Response) {
    const id = req.params.id;
    const { user_ids, time, location, description, title, alarms } = req.body;

    try {
      const event = await AppDataSource.event.update({
        where: { id },
        data: {
          user_ids,
          time,
          location,
          description,
          title,
          alarm: {
            deleteMany: { event_id: id },
            create: alarms.map((alarm: any) => ({
              user_id: alarm.user_id,
              trigger_time: alarm.trigger_time,
              message: alarm.message,
            })),
          },
        },
      });
      return res.status(200).send({ message: 'Event updated successfully', data: event });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, 'event', error);
    }
  }

  async removeEvent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const event = await AppDataSource.event.delete({
        where: { id },
      });

      const alarms = await AppDataSource.alarm.deleteMany({
        where: { event_id: id },
      });

      if (!event) {
        return Errors.notFound(res, 'event');
      }
      return res.status(200).send({ message: 'Event deleted successfully', data: event });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotDelete(res, 'event', error);
    }
  }
}