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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const models_1 = require("../../models");
const errors_1 = require("../../utils/errors");
const passcode_1 = __importDefault(require("../../utils/passcode"));
const validator_1 = require("../../middleware/validator");
const auth_1 = require("../../middleware/auth");
const gameRouter = express_1.default.Router();
const secret = config_1.default.get('jwtsecret');
// @route   POST api/game/create
// @desc    Create new game
// access   Private
gameRouter.post('/create', auth_1.verifyOptionalToken, validator_1.validateCreateGameFields, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { maxNumberOfRounds, hideScores } = req.body;
    try {
        const game = new models_1.Game({
            passcode: passcode_1.default(),
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
            userId: ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId) || null,
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
        yield game.save(); // save all changes
        // create and send game token
        jsonwebtoken_1.default.sign({
            userId: ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId) || null,
            playerId: game.players[0].id,
            isGamemaster: true,
            gameId: game.id,
        }, secret, { algorithm: 'HS256', expiresIn: 60 * 60 * 6 }, (err, token) => {
            if (err)
                errors_1.sendServerError(res, err);
            else
                res.json({ token, gameId: game.id, playerId: game.players[0].id });
        });
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// player leave game
// end game (gamemaster)
// restart game
exports.default = gameRouter;
