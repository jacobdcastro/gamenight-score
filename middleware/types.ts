import { Request, Response, NextFunction } from 'express';

export type MiddlewareFn = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => void;

export interface IVerifiedRequest extends Request {
  user?: {
    isGuest?: boolean;
    userId?: string;
    playerId?: string;
    gameId?: string;
    isGamemaster?: boolean;
  };
}
