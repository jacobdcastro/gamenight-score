"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerSchema = void 0;
const mongoose_1 = require("mongoose");
const RoundPlayed_1 = require("./RoundPlayed");
const playerSchemaFields = {
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    isGamemaster: {
        type: Boolean,
        required: true,
    },
    gmCreated: {
        type: Boolean,
        required: true,
    },
    deck: {
        type: Number,
    },
    avatar: {
        color: {
            type: String,
            required: false,
        },
        icon: {
            type: String,
            required: false,
        },
    },
    connected: {
        type: Boolean,
    },
    totalScore: {
        type: Number,
    },
    roundsPlayed: [RoundPlayed_1.roundPlayedSchema],
};
exports.playerSchema = new mongoose_1.Schema(playerSchemaFields);
const Player = mongoose_1.model('Player', exports.playerSchema);
exports.default = Player;
