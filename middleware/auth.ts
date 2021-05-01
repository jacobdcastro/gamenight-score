import jwt from 'jsonwebtoken';
import config from 'config';
import { MiddlewareFn } from './types';

export const verifyToken: MiddlewareFn = (req, res, next) => {
  // Get token form header
  const token = req.header('x-auth-token');

  // Check if no token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  jwt.verify(token, config.get('jwtsecret'), (err: any, user: any) => {
    if (err) {
      res.status(403).json({ msg: 'Token is not valid' });
    }
    req.user = user;
    next();
  });
};

export const verifyId: MiddlewareFn = (req, res, next) => {
  if (req?.user?.id === req?.params?.playerId) next();
  else res.status(403).json({ msg: 'You cannot access this route' });
};

export const verifyGamemaster: MiddlewareFn = (req, res, next) => {
  // TODO check if { gamemaster: true }
};
