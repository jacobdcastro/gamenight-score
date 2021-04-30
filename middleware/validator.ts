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

// for route /api/player/:playerId/edit
export const validatePlayerEditFields = [
  param('playerId').not().isEmpty(),
  body('name').optional(),
  body('username').optional(),
  body('password').optional().isLength({ min: 6 }),
  body('color').optional().isLength({ min: 7, max: 7 }),
  body('icon').optional(),
  validateReq,
];
