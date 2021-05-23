"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundSchema = void 0;
const mongoose_1 = require("mongoose");
const PlayerScore_1 = require("./PlayerScore");
const roundSchemaFields = {
    roundNumber: {
        type: Number,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
        default: Date.now,
    },
    winner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Player',
    },
    playerScores: [PlayerScore_1.playerScoreSchema],
    inProgress: {
        type: Boolean,
        required: true,
    },
    finished: {
        type: Boolean,
        required: true,
    },
    allGmPlayersScoresSubmitted: {
        type: Boolean,
        required: true,
    },
    allScoresSubmitted: {
        type: Boolean,
        required: true,
    },
    newRoundReady: {
        type: Boolean,
        required: true,
    },
};
exports.roundSchema = new mongoose_1.Schema(roundSchemaFields);
const Round = mongoose_1.model('Round', exports.roundSchema);
exports.default = Round;
