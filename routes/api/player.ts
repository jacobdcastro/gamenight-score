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
        avatar: {
          color: '#ffffff',
          icon: 'https://google.com/img-123123123',
        },
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

// @route   POST api/:playerId/edit/game/:gameId
// @desc    Edit in-game player fields
// access   Private (in-game player)
playerRouter.put(
  '/:playerId/edit/game/:gameId',
  verifyToken,
  verifyPlayerGameIds,
  validatePlayerEditFields,
  async (req: IVerifiedRequest, res: Response) => {
    const { playerId, gameId } = req.params;
    const { name, color, icon } = req.body;

    try {
      const game = await Game.findById(gameId); // find game

      if (game) {
        const player = game.players.id(playerId); // find player

        // change player fields
        if (player) {
          if (name) player.name = name;
          if (color) player.avatar.color = color;
          if (icon) player.avatar.icon = icon;
        }

        game?.save(); // save changes
        res.json({ player: game.players.id(playerId), gameId: game.id });
      }
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// gamemaster create player

// player post score

// player leave game

export default playerRouter;
