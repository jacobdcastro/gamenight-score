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
const errors_1 = require("../../utils/errors");
const router = express_1.default.Router();
// @route   POST api/auth/sign
// @desc    Sign JWT for init player state
// access   Public
router.post('/sign', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const payload = { userId };
        jsonwebtoken_1.default.sign(payload, config_1.default.get('jwtsecret'), { expiresIn: 60 * 60 });
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   POST api/auth/sign/game
// @desc    Sign JWT for player to write to game data
// access   Private
router.post('/sign/game', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, isGamemaster } = req.body;
    try {
        const payload = { userId, isGamemaster };
        jsonwebtoken_1.default.sign(payload, config_1.default.get('jwtsecret'), { expiresIn: 60 * 60 * 3 });
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
exports.default = router;
