import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { Game, Player, Round } from '../../models';
import { GameDoc } from '../../models/Game';
import { sendServerError } from '../../utils/errors';
import generatePasscode from '../../utils/passcode';
import { validateCreateGameFields } from '../../middleware/validator';
import { verifyOptionalToken, verifyToken } from '../../middleware/auth';
import { IVerifiedRequest } from '../../middleware/types';

const gameRouter = express.Router();

const secret: string = config.get('jwtsecret');

// @route   POST api/game/create
// @desc    Create new game
// access   Private
gameRouter.post(
  '/create',
  verifyOptionalToken,
  validateCreateGameFields,
  async (req: IVerifiedRequest, res: Response) => {
    const { maxNumberOfRounds, hideScores } = req.body;

    try {
      const game = new Game({
        passcode: generatePasscode(),
        players: [],
        maxNumberOfRounds,
        currentRoundNum: 1,
        rounds: [],
        hideScores,
        dateCreated: new Date(),
        startTime: null,
        endTime: null,
        expired: false,
      });

      // add first round to rounds[]
      game.rounds.push({
        roundNumber: 1,
        startTime: null,
        endTime: null,
        winner: null,
        playerScores: [],
        inProgress: false,
        finished: false,
        allGmPlayersScoresSubmitted: false,
        allScoresSubmitted: false,
        newRoundReady: false,
      });

      // add gamemaster to players[]
      game.players.push({
        name: 'name',
        userId: req?.user?.userId || null,
        avatar: {
          color: '#ffffff',
          icon: 'https://google.com/img-123123123',
        },
        isGamemaster: true,
        gmCreated: false,
        deck: 0,
        connected: true,
        totalScore: 0,
        roundsPlayed: [],
      });

      game.currentRoundNum = game.rounds[0].roundNumber; // set first round as 'current round'

      // create and save game creator as Gamemaster
      await await game.save(); // save all changes

      // create and send game token
      jwt.sign(
        {
          userId: req?.user?.userId || null,
          playerId: game.players[0].id,
          isGamemaster: true,
          gameId: game.id,
        },
        secret,
        { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
        (err, token) => {
          if (err) sendServerError(res, err);
          else
            res.json({ token, gameId: game.id, playerId: game.players[0].id });
        }
      );
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// player leave game

// end game (gamemaster)

// restart game

export default gameRouter;
