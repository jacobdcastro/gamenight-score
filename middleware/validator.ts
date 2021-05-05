import { body, param, validationResult } from 'express-validator';
import { MiddlewareFn } from './types';

export const validateReq: MiddlewareFn = (req, res, next) => {
  const errors = validationResult(req);
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
  body(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  validateReq,
];

export const validateUserIdParam = param('userId').not().isEmpty();
export const validatePlayerIdParam = param('playerId').not().isEmpty();
export const validateGameIdParam = param('gameId').not().isEmpty();

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
  body('userId').optional(),
  body('maxNumberOfRounds').isNumeric(),
  body('hideScores').isBoolean(),
  validateReq,
];

// for route /api/game/join
export const validatePasscode = [
  body('passcode').isLength({ min: 4, max: 4 }),
  validateReq,
];

// for route api/round/winner/:gameId
export const validateRoundWinner = [
  body('winnerPlayerId').isString(),
  validateReq,
];

// for route api/round/score/:playerId/:gameId
export const validateRoundScoreSubmission = [
  body('score').isNumeric(),
  body('roundNum').isNumeric(),
  validateReq,
];
