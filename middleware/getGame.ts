import { VerifiedMiddlewareFn } from './types';
import { Game } from '../models';
import { sendServerError } from '../utils/errors';

export const getGameById: VerifiedMiddlewareFn = async (req, res, next) => {
  const { gameId } = req.params;
  try {
    const game = await Game.findById(gameId); // find game
    req.game = game;
    next();
  } catch (err) {
    sendServerError(err, res);
  }
};

// export const getGameByPasscode: VerifiedMiddlewareFn = async (
//   req,
//   res,
//   next
// ) => {};
