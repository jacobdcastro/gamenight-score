"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const userSchemaFields = {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gamesPlayed: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Game',
        },
    ],
};
exports.userSchema = new mongoose_1.Schema(userSchemaFields);
const User = mongoose_1.model('User', exports.userSchema);
exports.default = User;
