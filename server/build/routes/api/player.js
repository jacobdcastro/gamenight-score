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
const validator_1 = require("../../middleware/validator");
const models_1 = require("../../models");
const errors_1 = require("../../utils/errors");
const auth_1 = require("../../middleware/auth");
const playerRouter = express_1.default.Router();
const secret = config_1.default.get('jwtsecret');
// @route   POST api/player/join
// @desc    Join created game
// access   Public
playerRouter.post('/join', validator_1.validatePasscode, auth_1.verifyOptionalToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { passcode } = req.body;
    const userId = !req.user || req.user.isGuest
        ? null
        : req.user.userId
            ? req.user.userId.toString()
            : null;
    try {
        const game = yield models_1.Game.findOne({ passcode });
        const player = new models_1.Player({
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
                const user = yield models_1.User.findById(userId);
                user === null || user === void 0 ? void 0 : user.gamesPlayed.push(game.id);
            }
            // add created player to game.players[]
            game.players.push(player);
            game.save();
            // create and send game token
            jsonwebtoken_1.default.sign({ playerId: player.id, isGamemaster: false, gameId: game.id, userId }, secret, { algorithm: 'HS256', expiresIn: 60 * 60 * 6 }, (err, token) => {
                if (err)
                    errors_1.sendServerError(res, err);
                else
                    res.json({ token, gameId: game.id, playerId: player.id });
            });
        }
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   POST api/:playerId/edit/game/:gameId
// @desc    Edit in-game player fields
// access   Private (in-game player)
playerRouter.put('/:playerId/edit/game/:gameId', auth_1.verifyToken, auth_1.verifyPlayerGameIds, validator_1.validatePlayerEditFields, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playerId, gameId } = req.params;
    const { name, color, icon } = req.body;
    try {
        const game = yield models_1.Game.findById(gameId); // find game
        if (game) {
            const player = game.players.id(playerId); // find player
            // change player fields
            if (player) {
                if (name)
                    player.name = name;
                if (color)
                    player.avatar.color = color;
                if (icon)
                    player.avatar.icon = icon;
            }
            game === null || game === void 0 ? void 0 : game.save(); // save changes
            res.json({ player: game.players.id(playerId), gameId: game.id });
        }
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// gamemaster create player
// player post score
// player leave game
exports.default = playerRouter;
