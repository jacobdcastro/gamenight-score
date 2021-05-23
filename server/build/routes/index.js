"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundRouter = exports.playerRouter = exports.gameRouter = exports.userRouter = void 0;
var user_1 = require("./api/user");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
var game_1 = require("./api/game");
Object.defineProperty(exports, "gameRouter", { enumerable: true, get: function () { return __importDefault(game_1).default; } });
var player_1 = require("./api/player");
Object.defineProperty(exports, "playerRouter", { enumerable: true, get: function () { return __importDefault(player_1).default; } });
var round_1 = require("./api/round");
Object.defineProperty(exports, "roundRouter", { enumerable: true, get: function () { return __importDefault(round_1).default; } });
