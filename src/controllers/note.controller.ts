import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";
import { validate as isUUID } from "uuid";
import {replacer} from "../utility/json.replacer";

const MINUTES_FOR_ALARM = 3;

export default class NoteController {
  constructor() {
    this.createNote = this.createNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.getSingleNote = this.getSingleNote.bind(this);
    this.getNotesByUser = this.getNotesByUser.bind(this);
    this.sendNote = this.sendNote.bind(this);
  }

  async createNote(req: Request, res: Response) {
    const { user_id, related_user_ids, related_urls, title, content } = req.body;

    try {
      const note = await AppDataSource.noteentity.create({
        data: {
          user_id: user_id as string,
          related_user_ids: related_user_ids as string[],
          related_urls: related_urls as string[],
          title: title as string,
          content: content as string,
        },
      });

      related_user_ids.push(user_id);

      for (const id of related_user_ids) {
        await AppDataSource.users.update({
          where: { user_id: id },
          data: {
            noteentity: {
              connect: {
                id: note.id
              }
            }
          }
        });
      };

      return res.status(201).send({ message: "Note created successfully", data: note });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "note", error);
    }
  }

  async removeNote(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const note = await AppDataSource.noteentity.delete({
        where: { id },
      });
      return res.status(200).send({ message: "Note removed successfully", data: note });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotDelete(res, "note", error);
    }
  }

  async updateNote(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id, related_user_ids, related_urls, title, content } = req.body;

    try {
      if (!isUUID(user_id)) {
        throw new Error(`Invalid UUID format for user_id: ${user_id}`);
      }

      const formattedRelatedUserIds = related_user_ids.map((id: string) => {
        if (!isUUID(id)) {
          throw new Error(`Invalid UUID format for related_user_id: ${id}`);
        }
        return id;
      });

      const note = await AppDataSource.noteentity.update({
        where: { id },
        data: {
          user_id,
          related_user_ids: formattedRelatedUserIds,
          related_urls,
          title,
          content,
          updated_at: new Date(Date.now()),
        },
      });

      related_user_ids.push(user_id);

      for (const id of related_user_ids) {
        await AppDataSource.users.update({
          where: { user_id: id },
          data: {
            noteentity: {
              connect: {
                id: note.id
              }
            }
          }
        });
      };

      return res.status(200).send({ message: "Note updated successfully", data: note });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotUpdate(res, "note", error);
    }
  }

  async getSingleNote(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const note = await AppDataSource.noteentity.findUnique({
        where: { id },
      });
      if (!note) {
        return Errors.notFound(res, "note");
      }
      return res.status(200).send({ message: "Note retrieved successfully", data: note });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "note", error);
    }
  }

  async getNotesByUser(req: Request, res: Response) {
    const { userId } = req.params;

    if (!userId || userId === "" || userId === undefined) {
      return Errors.badRequest(res, "notes");
    }

    try {
      const notes = await AppDataSource.noteentity.findMany({
        where: {
          OR: [
            { user_id: userId },
            { related_user_ids: { has: userId } }
          ]
        }
      });
      if (!notes) {
        return Errors.notFound(res, "notes");
      }
      return res.status(200).send({ message: "Notes retrieved successfully", data: notes });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotRetrieve(res, "notes", error);
    }
  }

  async sendNote(req: Request, res: Response) {
    const { note_id, user_ids } = req.body;

    const noteId = JSON.parse(JSON.stringify(note_id, replacer));
    const userIds = user_ids.map(user_id => JSON.parse(JSON.stringify(user_id, replacer)));

    try {
      const note = await AppDataSource.noteentity.findUnique({
        where: { id: noteId.replace(/"/g, '') },
      });

      if (!note) {
        return Errors.notFound(res, "note");
      }

      let formattedUserIds = userIds.map((id: string) => {
        if (!isUUID(id)) {
          throw new Error(`Invalid UUID format for user_id: ${id}`);
        }
        return id;
      });

      console.log(formattedUserIds);

      formattedUserIds = formattedUserIds.filter(
          (userId: string) => note.related_user_ids.includes(userId)
      );

      console.log(formattedUserIds);

      if (formattedUserIds.length === 0) {
        return Errors.badRequest(res, "All users are already related to this note.");
      }

      const timeout = new Date(Date.now() + 1000 * 60 * MINUTES_FOR_ALARM);

      const updatedNote = await AppDataSource.noteentity.update({
        where: { id: noteId },
        data : {
          related_user_ids: {
            push: formattedUserIds
          }
        }
      });

      const event = await AppDataSource.event.create({
        data: {
          user_ids: updatedNote.related_user_ids,
          time: timeout,
          location: "N/A",
          description: `${note.content}\n\nFROM: ${note.user_id}`,
          title: note.title,
        }
      });

      const alarmsData = userIds.map((user_id: string) => ({
        user_id,
        event_id: event.id,
        trigger_time: new Date(Date.now() + 1000 * 60 * MINUTES_FOR_ALARM),
        message: `${note.title}: ${note.content}\n\nFROM: ${note.user_id}`,
      }));

      try {
        const set_alarms = await AppDataSource.alarm.createMany({
          data: alarmsData
        });
      }
      catch (error: any) {
        throw error;
      }

      return res.status(200).send({ message: "Note sent successfully", data: {updatedNote, event, alarmsData } });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "note", error);
    }
  }
}