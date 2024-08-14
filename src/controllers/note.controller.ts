import AppDataSource from "../utility/data-source";
import {assertIsError} from "../utility/error.guard";
import {Errors} from "../utility/dberrors";
import {Request, Response} from "express";

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
          user_id,
          related_user_ids,
          related_urls,
          title,
          content,
        },
      });
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
      const note = await AppDataSource.noteentity.update({
        where: { id },
        data: {
          user_id,
          related_user_ids,
          related_urls,
          title,
          content,
        },
      });
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

    try {
      const notes = await AppDataSource.noteentity.findMany({
        where: { user_id: userId },
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
    const { userId } = req.params;
    const { noteId } = req.body;

    try {
      const note = await AppDataSource.noteentity.findUnique({
        where: { id: noteId },
      });
      if (!note) {
        return Errors.notFound(res, "note");
      }
      // Implement the logic to send the note to the user
      // This could involve creating a notification, sending an email, etc.
      return res.status(200).send({ message: "Note sent successfully", data: note });
    } catch (error: any) {
      assertIsError(error);
      return Errors.couldNotCreate(res, "note", error);
    }
  }
}