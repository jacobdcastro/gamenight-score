"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGamemaster = exports.verifyPlayerGameIds = exports.verifyGameId = exports.verifyUserId = exports.verifyOptionalToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const verifyToken = (req, res, next) => {
    // Get token form header
    const token = req.header('x-auth-token');
    // Check if no token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    // Verify token
    jsonwebtoken_1.default.verify(token, config_1.default.get('jwtsecret'), (err, user) => {
        if (err) {
            res.status(403).json({ msg: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
};
exports.verifyToken = verifyToken;
const verifyOptionalToken = (req, res, next) => {
    // Get token form header
    const token = req.header('x-auth-token');
    req.user = {};
    if (!token) {
        req.user.isGuest = true;
        next();
    }
    else {
        jsonwebtoken_1.default.verify(token, config_1.default.get('jwtsecret'), (err, user) => {
            if (err) {
                res.status(403).json({ msg: 'Token is not valid' });
            }
            req.user = user;
            next();
        });
    }
};
exports.verifyOptionalToken = verifyOptionalToken;
const verifyUserId = (req, res, next) => {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId) === ((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.userId))
        next();
    else
        res.status(403).json({ msg: 'You cannot access this route' });
};
exports.verifyUserId = verifyUserId;
const verifyGameId = (req, res, next) => {
    var _a, _b;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.gameId) === ((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.gameId))
        next();
    else
        res.status(403).json({ msg: 'You cannot access this route' });
};
exports.verifyGameId = verifyGameId;
const verifyPlayerGameIds = (req, res, next) => {
    var _a, _b, _c, _d;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.playerId) === ((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.playerId) &&
        ((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.gameId) === ((_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.gameId))
        next();
    else
        res.status(403).json({ msg: 'You cannot access this route' });
};
exports.verifyPlayerGameIds = verifyPlayerGameIds;
const verifyGamemaster = (req, res, next) => {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.isGamemaster) === true)
        next();
    else
        res.status(403).json({
            msg: 'You cannot access this route as you are not the established Gamemaster.',
        });
};
exports.verifyGamemaster = verifyGamemaster;
