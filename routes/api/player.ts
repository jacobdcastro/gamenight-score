import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import {
  validateGameIdParam,
  validateGamePlayerIdParams,
  validatePasscode,
  validatePlayerEditFields,
} from '../../middleware/validator';
import { Game, Player, User } from '../../models';
import { sendServerError } from '../../utils/errors';
import {
  verifyGameId,
  verifyGamemaster,
  verifyOptionalToken,
  verifyPlayerGameIds,
  verifyToken,
  verifyUserId,
} from '../../middleware/auth';
import { IVerifiedRequest } from '../../middleware/types';
import { getGameById } from '../../middleware/getGame';
import {
  correctPlayerRoundsPlayed,
  orderPlayersByScore,
} from '../../utils/corrections';
import { PlayerScoreDoc } from '../../models/PlayerScore';

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
        status: '',
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
        await game.save();

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

// ? player re-join game??

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

        await game.save(); // save changes
        res.json({ player: game.players.id(playerId), gameId: game.id });
      }
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// add gmCreated player

// TODO ====================
// todo TEST AFTER UI
// TODO ====================
// @route   PUT api/player/correct/:gameId
// @desc    Edit any player score from any round
// access   Private (gamemaster)
playerRouter.put(
  '/correct/:gameId',
  validateGameIdParam,
  verifyToken,
  verifyGameId,
  verifyGamemaster,
  getGameById,
  async (req: IVerifiedRequest, res: Response) => {
    const { score, roundNum, playerId } = req.body;
    const { game } = req;

    try {
      // save score in RoundDoc
      const roundDoc = game.rounds[roundNum - 1];
      const playerScoreInRound = roundDoc.playerScores.find(
        (p: PlayerScoreDoc) => p.player === playerId
      );
      playerScoreInRound.roundScore = score;

      // save score in PlayerDoc
      const player = game.players.find((p) => p.id === playerId);
      player.roundsPlayed[roundNum - 1].roundScore = score;

      // correct totalScore and totalScoreToRounds
      await orderPlayersByScore(
        correctPlayerRoundsPlayed(game, playerId)
      ).save();
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// player leave game

export default playerRouter;
