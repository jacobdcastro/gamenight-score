import { body, param, validationResult } from 'express-validator';
import { MiddlewareFn } from './types';

export const validateReq: MiddlewareFn = (req, res, next) => {
  const errors = validationResult(req);
  console.log({ errors });
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

// for routes:
//   /api/player/signup
//   /api/player/login
export const validateUsernameAndPassword = [
  body('username', 'Username is required').not().isEmpty(),
  body('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
    .exists(),
  validateReq,
];

export const validateUserIdParam = param('userId').exists();
export const validatePlayerIdParam = param('playerId').exists();
export const validateGameIdParam = param('gameId').exists();
export const validateGamePlayerIdParams = [
  validatePlayerIdParam,
  validateGameIdParam,
  validateReq,
];

// for route /api/player/:playerId/edit
export const validatePlayerEditFields = [
  validatePlayerIdParam,
  body('name').optional(),
  // TODO use regex to check for hexcode i.e. #ffffff
  body('color').optional().isLength({ min: 7, max: 7 }),
  // TODO use regex to check for image url
  body('icon').optional(),
  validateReq,
];

// for route /api/game/create
export const validateCreateGameFields = [
  body('maxNumberOfRounds').isNumeric().exists(),
  body('hideScores').isBoolean().exists(),
  validateReq,
];

// for route /api/game/join
export const validatePasscode = [
  body('passcode').isLength({ min: 4, max: 4 }).exists(),
  validateReq,
];

// for route api/round/winner/:gameId
export const validateRoundWinner = [
  body('winnerPlayerId').isString().exists(),
  validateReq,
];

// for route api/round/score/:playerId/:gameId
export const validateRoundScoreSubmission = [
  body('score').isNumeric().exists(),
  body('roundNum').isNumeric().exists(),
  validateReq,
];
