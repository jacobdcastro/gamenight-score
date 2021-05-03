import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { Game, Player, Round } from '../../models';
import { GameSchema } from '../../models/Game';
import { sendServerError } from '../../utils/errors';
import generatePasscode from '../../utils/passcode';
import { validateCreateGameFields } from '../../middleware/validator';
import { verifyOptionalToken, verifyToken } from '../../middleware/auth';
import { IVerifiedRequest } from '../../middleware/types';

const gameRouter = express.Router();

const secret: string = config.get('jwtsecret');

// @route   POST api/game/create
// @desc    Create new game (with token)
// access   Private
gameRouter.post(
  '/create',
  verifyOptionalToken,
  validateCreateGameFields,
  async (req: IVerifiedRequest, res: Response) => {
    const { userId, maxNumberOfRounds, hideScores } = req.body;

    const gameData: GameSchema = {
      passcode: generatePasscode(),
      players: [],
      maxNumberOfRounds,
      currentRound: '',
      rounds: [],
      hideScores,
      dateCreated: new Date(),
      startTime: null,
      endTime: null,
      expired: false,
    };

    try {
      // initial round 1 data
      const round = new Round({
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

      // player document for gamemaster
      const player = new Player({
        userId: userId || null,
        name: 'name',
        gmCreated: false,
        isGamemaster: true,
        deck: 0,
        connected: true,
        totalScore: 0,
        roundsPlayed: [],
      });

      gameData.rounds.push(round); // add first round to rounds[]
      gameData.players.push(player); // add gamemaster to players[]
      gameData.currentRound = round.id; // set first round as 'current round'

      // create and save game creator as Gamemaster
      const game = new Game(gameData);
      await game.save(); // save all changes

      // create and send game token
      jwt.sign(
        {
          userId: userId || null,
          playerId: player.id,
          isGamemaster: true,
          gameId: game.id,
        },
        secret,
        { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
        (err, token) => {
          if (err) sendServerError(res, err);
          else res.json({ token, gameId: game.id });
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
