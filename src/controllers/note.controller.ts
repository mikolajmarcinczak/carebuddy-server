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
    // Create a new note
  }

  async removeNote(req: Request, res: Response) {
    // Remove a note
  }

  async updateNote(req: Request, res: Response) {
    // Update a note
  }

  async getSingleNote(req: Request, res: Response) {
    // Get a single note
  }

  async getNotesByUser(req: Request, res: Response) {
    // Get all notes by user
  }

  async sendNote(req: Request, res: Response) {
    // Send a note to a user
  }
}