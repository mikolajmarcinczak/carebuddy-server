import {Response} from 'express';

export class Errors {
  static notFound = (res: Response, context: string) => {
    res.json({message: 'Not found', context: context});
    res.status(404);
    console.error('Not found: ', context);
  }

  static badRequest = (res: Response, context: string) => {
    res.json({message: 'Bad request', context: context});
    res.status(400);
    console.error('Bad request.', context)
  }

  static couldNotRetrieve = (res: Response, context: string, error: Error) => {
    res.json({message: 'Could not retrieve', context: context, error: error});
    res.status(500);
    console.error('Could not retrieve: ', error);
  }

  static couldNotCreate = (res: Response, context: string, error: Error) => {
    res.json({message: 'Could not create', context: context, error: error});
    res.status(500);
    console.error('Could not create: ', error);
  }

  static couldNotUpdate = (res: Response, context: string, error: Error) => {
    res.json({message: 'Could not update', context: context, error: error});
    res.status(500);
    console.error('Could not update: ', error);
  }

  static couldNotDelete = (res: Response, context: string, error: Error) => {
    res.json({message: 'Could not delete', context: context, error: error});
    res.status(500);
    console.error('Could not delete: ', error);
  }
}