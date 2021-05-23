"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const validator_1 = require("../../middleware/validator");
const errors_1 = require("../../utils/errors");
const models_1 = require("../../models");
const roundRouter = express_1.default.Router();
// TODO ===============================
// TODO ===============================
// todo test ALL /api/round endpoints!!
// TODO ===============================
// TODO ===============================
// @route   POST api/round/start/:gameId
// @desc    Start current round of play
// access   Private (gamemaster)
roundRouter.post('/start/:gameId', auth_1.verifyToken, validator_1.validateGameIdParam, auth_1.verifyGameId, auth_1.verifyGamemaster, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const now = new Date();
    try {
        const game = yield models_1.Game.findById(gameId); // find game
        if (game) {
            // set start time if first round has begun
            if (game.currentRoundNum === 1)
                game.startTime = now;
            // set current round state to 'in progress'
            const currentRound = game.rounds[game.currentRoundNum - 1];
            currentRound.startTime = now;
            currentRound.inProgress = true;
            game.save();
        }
        res.status(200).send(`Round ${game === null || game === void 0 ? void 0 : game.currentRoundNum} started!`);
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   POST api/round/end/:gameId
// @desc    End current round of play
// access   Private (gamemaster)
roundRouter.post('/end/:gameId', auth_1.verifyToken, validator_1.validateGameIdParam, auth_1.verifyGameId, auth_1.verifyGamemaster, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const now = new Date();
    try {
        const game = yield models_1.Game.findById(gameId); // find game
        if (game) {
            // set end time if last round has ended
            if (game.currentRoundNum >= game.maxNumberOfRounds)
                game.endTime = now;
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
        res.status(200).send(`Round ${game === null || game === void 0 ? void 0 : game.currentRoundNum} ended!`);
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   POST api/round/winner/:gameId
// @desc    Select round winner
// access   Private (gamemaster)
roundRouter.post('/winner/:gameId', auth_1.verifyToken, validator_1.validateGameIdParam, auth_1.verifyGameId, auth_1.verifyGamemaster, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const { winnerPlayerId } = req.body;
    try {
        const game = yield models_1.Game.findById(gameId); // find game
        if (game) {
            // set end time if last round has ended
            const currentRound = game.rounds[game.currentRoundNum - 1];
            currentRound.winner = winnerPlayerId;
            game.save();
        }
        res
            .status(200)
            .send(`Player ${winnerPlayerId} successfully set as Round ${game === null || game === void 0 ? void 0 : game.currentRoundNum} winner!`);
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   POST api/round/score/:playerId/:gameId
// @desc    Player submit round score
// access   Private (in-game player)
roundRouter.post('/score/:playerId/:gameId', auth_1.verifyToken, validator_1.validateGamePlayerIdParams, auth_1.verifyPlayerGameIds, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId, playerId } = req.params;
    const { score, roundNum } = req.body;
    try {
        const game = yield models_1.Game.findById(gameId); // find game
        if (game) {
            const round = game.rounds[game.currentRoundNum - 1];
            const player = game.players.id(playerId);
            if (round && player) {
                // add score to player.roundsPlayed[]
                const _roundsPlayed = [...player.roundsPlayed];
                const totalScoreToRound = _roundsPlayed.reduce((n, r) => n + r.roundScore, 0) + score;
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
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// next round (automatic), same as start round?
exports.default = roundRouter;
