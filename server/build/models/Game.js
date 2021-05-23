"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Player_1 = require("./Player");
const Round_1 = require("./Round");
const gameSchemaFields = {
    passcode: {
        type: String,
        required: true,
    },
    players: [Player_1.playerSchema],
    maxNumberOfRounds: {
        type: Number,
        default: null,
    },
    currentRoundNum: {
        type: Number,
        default: 1,
    },
    rounds: [Round_1.roundSchema],
    hideScores: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    startTime: {
        type: Date,
        default: null,
    },
    endTime: {
        type: Date,
        default: null,
    },
    expired: {
        type: Boolean,
    },
};
const gameSchema = new mongoose_1.Schema(gameSchemaFields);
const Game = mongoose_1.model('Game', gameSchema);
exports.default = Game;
