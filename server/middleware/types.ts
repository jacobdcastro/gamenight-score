import { Request, Response, NextFunction } from 'express';
import { GameDoc } from '../models/Game';

export interface IVerifiedRequest extends Request {
  user?: {
    isGuest?: boolean;
    userId?: string;
    playerId?: string;
    gameId?: string;
    isGamemaster?: boolean;
  };
  game?: GameDoc;
}

export type MiddlewareFn = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => void;

export type VerifiedMiddlewareFn = (
  req: IVerifiedRequest,
  res: Response,
  next: NextFunction
) => void;
