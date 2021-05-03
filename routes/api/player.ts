import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import {
  validatePasscode,
  validatePlayerEditFields,
} from '../../middleware/validator';
import { Game, Player, User } from '../../models';
import { sendServerError } from '../../utils/errors';
import {
  verifyOptionalToken,
  verifyPlayerGameIds,
  verifyToken,
} from '../../middleware/auth';
import { IVerifiedRequest } from '../../middleware/types';

const playerRouter = express.Router();

const secret: string = config.get('jwtsecret');

// @route   POST api/player/join
// @desc    Join created game
// access   Public
playerRouter.post(
  '/join',
  validatePasscode,
  verifyOptionalToken,
  async (req: IVerifiedRequest, res: Response) => {
    const { passcode } = req.body;
    const userId =
      !req.user || req.user.isGuest
        ? null
        : req.user.userId
        ? req.user.userId.toString()
        : null;

    try {
      const game = await Game.findOne({ passcode });

      const player = new Player({
        userId,
        name: 'name',
        isGamemaster: false,
        gmCreated: false,
        deck: 0,
        connected: true,
        totalScore: 0,
        roundsPlayed: [],
      });

      if (game) {
        // add game ID to user.gamesPlayed[] if user exists
        if (userId) {
          const user = await User.findById(userId);
          user?.gamesPlayed.push(game.id);
        }

        // add created player to game.players[]
        game.players.push(player);
        game.save();

        // create and send game token
        jwt.sign(
          { playerId: player.id, isGamemaster: false, gameId: game.id, userId },
          secret,
          { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
          (err, token) => {
            if (err) sendServerError(res, err);
            else res.json({ token, gameId: game.id, playerId: player.id });
          }
        );
      }
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// player edit fields
playerRouter.post(
  '/:playerId/edit/game/:gameId',
  verifyToken,
  verifyPlayerGameIds,
  validatePlayerEditFields,
  async (req: Request, res: Response) => {
    const { playerId, gameId } = req.params;
    try {
      const game = await Game.findOne({ _id: gameId });

      // TODO ===================================
      // TODO ===================================
      // TODO figure out typing for finding subdoc by ID
      // TODO ===================================
      // TODO ===================================
      // const player = await game.players;

      const result = await Player.updateOne(
        { _id: req.params.userId },
        { ...req.body }
      );
      res.json(result);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// player post score

// player leave game

export default playerRouter;
