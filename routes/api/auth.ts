import express from 'express';
import jwt from 'jsonwebtoken';
import sendError from '../../helpers/error';

const router = express.Router();

// @route   POST api/auth/sign
// @desc    Sign JWT for init player state
// access   Public
router.post('/sign', async (req, res) => {
  const { userId } = req.body;

  try {
    const payload = { userId };

    jwt;
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
