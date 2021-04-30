import { Request, Response, NextFunction } from 'express';

export type MiddlewareFn = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => void;
