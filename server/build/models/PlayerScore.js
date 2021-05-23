"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerScoreSchema = void 0;
const mongoose_1 = require("mongoose");
const playerScoreSchemaFields = {
    player: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Player',
    },
    roundScore: {
        type: Number,
        required: true,
    },
};
exports.playerScoreSchema = new mongoose_1.Schema(playerScoreSchemaFields);
const PlayerScore = mongoose_1.model('PlayerScore', exports.playerScoreSchema);
exports.default = PlayerScore;
