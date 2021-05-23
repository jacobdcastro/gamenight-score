"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundPlayedSchema = void 0;
const mongoose_1 = require("mongoose");
const roundPlayedSchemaFields = {
    round: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Round' },
    roundNum: { type: Number },
    roundScore: { type: Number },
    totalScoreToRound: { type: Number },
};
exports.roundPlayedSchema = new mongoose_1.Schema(roundPlayedSchemaFields);
const RoundPlayed = mongoose_1.model('RoundPlayed', exports.roundPlayedSchema);
exports.default = RoundPlayed;
