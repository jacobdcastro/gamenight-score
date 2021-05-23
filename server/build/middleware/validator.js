"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoundScoreSubmission = exports.validateRoundWinner = exports.validatePasscode = exports.validateCreateGameFields = exports.validatePlayerEditFields = exports.validateGamePlayerIdParams = exports.validateGameIdParam = exports.validatePlayerIdParam = exports.validateUserIdParam = exports.validateUsernameAndPassword = exports.validateReq = void 0;
const express_validator_1 = require("express-validator");
const validateReq = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    console.log({ errors });
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        next();
    }
};
exports.validateReq = validateReq;
// for routes:
//   /api/player/signup
//   /api/player/login
exports.validateUsernameAndPassword = [
    express_validator_1.body('username', 'Username is required').not().isEmpty(),
    express_validator_1.body('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
        .exists(),
    exports.validateReq,
];
exports.validateUserIdParam = express_validator_1.param('userId').exists();
exports.validatePlayerIdParam = express_validator_1.param('playerId').exists();
exports.validateGameIdParam = express_validator_1.param('gameId').exists();
exports.validateGamePlayerIdParams = [
    exports.validatePlayerIdParam,
    exports.validateGameIdParam,
    exports.validateReq,
];
// for route /api/player/:playerId/edit
exports.validatePlayerEditFields = [
    exports.validatePlayerIdParam,
    express_validator_1.body('name').optional(),
    // TODO use regex to check for hexcode i.e. #ffffff
    express_validator_1.body('color').optional().isLength({ min: 7, max: 7 }),
    // TODO use regex to check for image url
    express_validator_1.body('icon').optional(),
    exports.validateReq,
];
// for route /api/game/create
exports.validateCreateGameFields = [
    express_validator_1.body('maxNumberOfRounds').isNumeric().exists(),
    express_validator_1.body('hideScores').isBoolean().exists(),
    exports.validateReq,
];
// for route /api/game/join
exports.validatePasscode = [
    express_validator_1.body('passcode').isLength({ min: 4, max: 4 }).exists(),
    exports.validateReq,
];
// for route api/round/winner/:gameId
exports.validateRoundWinner = [
    express_validator_1.body('winnerPlayerId').isString().exists(),
    exports.validateReq,
];
// for route api/round/score/:playerId/:gameId
exports.validateRoundScoreSubmission = [
    express_validator_1.body('score').isNumeric().exists(),
    express_validator_1.body('roundNum').isNumeric().exists(),
    exports.validateReq,
];
