import express, { Response } from 'express';
import { IVerifiedRequest } from '../../middleware/types';
import {
  verifyGameId,
  verifyGamemaster,
  verifyPlayerGameIds,
  verifyToken,
} from '../../middleware/auth';
import {
  validateGameIdParam,
  validatePlayerIdParam,
} from '../../middleware/validator';
import { sendServerError } from '../../utils/errors';
import { Game } from '../../models';

const roundRouter = express.Router();

// TODO ===============================
// TODO ===============================
// todo test ALL /api/round endpoints!!
// TODO ===============================
// TODO ===============================

// @route   GET api/round/start/:gameId
// @desc    Start current round of play
// access   Private (gamemaster)
roundRouter.get(
  '/start/:gameId',
  verifyToken,
  validateGameIdParam,
  verifyGameId,
  verifyGamemaster,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId } = req.params;
    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        // set start time if first round has begun
        if (game.currentRoundNum === 1) game.startTime = new Date();

        // set current round state to 'in progress'
        const currentRound = game.rounds[game.currentRoundNum - 1];
        currentRound.inProgress = true;
        game.save();
      }
      res.status(200).send(`Round ${game?.currentRoundNum} started!`);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   GET api/round/end/:gameId
// @desc    End current round of play
// access   Private (gamemaster)
roundRouter.get(
  '/end/:gameId',
  verifyToken,
  validateGameIdParam,
  verifyGameId,
  verifyGamemaster,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId } = req.params;
    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        // set end time if last round has ended
        if (game.currentRoundNum === game.maxNumberOfRounds)
          game.endTime = new Date();

        // set current round state to 'finished'
        const currentRound = game.rounds[game.currentRoundNum - 1];
        currentRound.inProgress = false;
        currentRound.finished = true;
        game.save();
      }
      res.status(200).send(`Round ${game?.currentRoundNum} started!`);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   POST api/round/winner/:gameId
// @desc    Select round winner
// access   Private (gamemaster)
roundRouter.post(
  '/winner/:gameId',
  verifyToken,
  validateGameIdParam,
  verifyGameId,
  verifyGamemaster,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId } = req.params;
    const { winnerPlayerId } = req.body;

    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        // set end time if last round has ended
        const currentRound = game.rounds[game.currentRoundNum - 1];
        currentRound.winner = winnerPlayerId;
        game.save();
      }

      res
        .status(200)
        .send(
          `Player ${winnerPlayerId} successfully set as Round ${game?.currentRoundNum} winner!`
        );
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   POST api/round/score/:playerId/:gameId
// @desc    Player post round score
// access   Private (in-game player)
roundRouter.post(
  '/score/:playerId/:gameId',
  verifyToken,
  validatePlayerIdParam,
  validateGameIdParam,
  verifyPlayerGameIds,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId, playerId } = req.params;
    const { score, roundNum } = req.body;

    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        // save score in player.roundsPlayed {round, roundNum, roundScore, totalScoreToRound}
        // save score in round.playerScores {playerId, roundScore}
      }

      res.status(200).send(`Your score has been saved!`);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// next round (automatic), same as start round?

export default roundRouter;
