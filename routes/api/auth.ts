import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { sendServerError } from '../../utils/errors';

const router = express.Router();

// @route   POST api/auth/sign
// @desc    Sign JWT for init player state
// access   Public
router.post('/sign', async (req, res) => {
  const { userId } = req.body;

  try {
    const payload = { userId };

    jwt.sign(payload, config.get('jwtsecret'), { expiresIn: 60 * 60 });
  } catch (err) {
    sendServerError(res, err);
  }
});

// @route   POST api/auth/sign/game
// @desc    Sign JWT for player to write to game data
// access   Private
router.post('/sign/game', async (req, res) => {
  const { userId, isGamemaster } = req.body;

  try {
    const payload = { userId, isGamemaster };

    jwt.sign(payload, config.get('jwtsecret'), { expiresIn: 60 * 60 * 3 });
  } catch (err) {
    sendServerError(res, err);
  }
});

export default router;
