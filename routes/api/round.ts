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
  validateGamePlayerIdParams,
} from '../../middleware/validator';
import { sendServerError } from '../../utils/errors';
import { Game, RoundPlayed } from '../../models';

const roundRouter = express.Router();

// TODO ===============================
// TODO ===============================
// todo test ALL /api/round endpoints!!
// TODO ===============================
// TODO ===============================

// @route   POST api/round/start/:gameId
// @desc    Start current round of play
// access   Private (gamemaster)
roundRouter.post(
  '/start/:gameId',
  verifyToken,
  validateGameIdParam,
  verifyGameId,
  verifyGamemaster,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId } = req.params;
    const now = new Date();
    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        // set start time if first round has begun
        if (game.currentRoundNum === 1) game.startTime = now;

        // set current round state to 'in progress'
        const currentRound = game.rounds[game.currentRoundNum - 1];
        currentRound.startTime = now;
        currentRound.inProgress = true;
        game.save();
      }
      res.status(200).send(`Round ${game?.currentRoundNum} started!`);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   POST api/round/end/:gameId
// @desc    End current round of play
// access   Private (gamemaster)
roundRouter.post(
  '/end/:gameId',
  verifyToken,
  validateGameIdParam,
  verifyGameId,
  verifyGamemaster,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId } = req.params;
    const now = new Date();
    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        // set end time if last round has ended
        if (game.currentRoundNum >= game.maxNumberOfRounds) game.endTime = now;

        // set current round state to 'finished'
        const currentRound = game.rounds[game.currentRoundNum - 1];
        currentRound.endTime = now;
        currentRound.inProgress = false;
        currentRound.finished = true;

        // if no gmCreated players, mark as 'true'
        if (!game.players.some((p) => p.gmCreated))
          currentRound.allGmPlayersScoresSubmitted = true;

        game.save();
      }
      res.status(200).send(`Round ${game?.currentRoundNum} ended!`);
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
  validateGamePlayerIdParams,
  verifyPlayerGameIds,
  async (req: IVerifiedRequest, res: Response) => {
    const { gameId, playerId } = req.params;
    const { score, roundNum } = req.body;

    try {
      const game = await Game.findById(gameId); // find game
      if (game) {
        const round = game.rounds[game.currentRoundNum - 1];
        const player = game.players.id(playerId);

        if (round && player) {
          // add score to player.roundsPlayed[]
          const _roundsPlayed = [...player.roundsPlayed];
          const totalScoreToRound =
            _roundsPlayed.reduce((n, r) => n + r.roundScore, 0) + score;
          _roundsPlayed.push({
            round: round.id,
            roundNum: roundNum,
            roundScore: score,
            totalScoreToRound,
          });
          player.roundsPlayed = _roundsPlayed;

          // add score to round.playerScores[]
          const _playerScores = [...round.playerScores];
          _playerScores.push({ player: playerId, roundScore: score });
          round.playerScores = _playerScores;
        }
        game.save();
      }

      res.status(200).send(`Your score has been saved!`);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// next round (automatic), same as start round?

export default roundRouter;
