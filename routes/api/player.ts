import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import {
  validatePlayerEditFields,
  validatePlayerIdParam,
  validateUsernameAndPassword,
} from '../../middleware/validator';
import { Player } from '../../models';
import { PlayerSchema } from '../../models/Player';
import { sendServerError } from '../../utils/errors';
import { verifyToken, verifyId } from '../../middleware/auth';

const playerRouter = express.Router();

const secret: string = config.get('jwtsecret');

// @route   POST api/player/signup
// @desc    Create new player account
// access   Public
playerRouter.post(
  '/signup',
  validateUsernameAndPassword,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // check if username is taken
    const playerWithSameUsername = await Player.findOne({ username });
    if (playerWithSameUsername) {
      return res.status(400).json({ errors: [{ msg: 'Username taken' }] });
    }

    const playerData: PlayerSchema = {
      name: '',
      username,
      password,
      gmCreated: false,
      color: '',
      icon: '',
      gamesPlayed: [],
    };

    try {
      // hash password asyncronously
      const hash = await bcrypt.hash(password, 14);
      playerData.password = hash;

      // create and save new player in DB
      const player = new Player(playerData);
      await player.save();

      // create and send token
      jwt.sign(
        { id: player.id },
        secret,
        { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
        (err, token) => {
          if (err) sendServerError(res, err);
          else res.json({ token, player });
        }
      );
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   POST api/player/signup
// @desc    Login to player account
// access   Public
playerRouter.post(
  '/login',
  validateUsernameAndPassword,
  async (req: Request, res: Response) => {
    try {
      // find player document
      const player = await Player.findOne({ username: req.body.username });

      // if player doesn't exist, send error, prompt sign up
      if (!player) {
        res
          .status(400)
          .send("Username doesn't exist, would you like to sign up?");
      } else {
        // check if password in body matches password in DB
        const isMatch = await bcrypt.compare(
          req.body.password,
          player.password
        );
        if (isMatch) {
          jwt.sign(
            { id: player.id },
            secret,
            { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
            (err, token) => {
              if (err) sendServerError(res, err);
              else res.json({ token, player });
            }
          );
        } else {
          res.status(400).send('Incorrect password');
        }
      }
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   GET api/player/:playerId
// @desc    Get player data by ID
// access   Public
playerRouter.get(
  '/:playerId',
  validatePlayerIdParam,
  async (req: Request, res: Response) => {
    try {
      const player = await Player.findById(req.params.playerId);
      res.json(player);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   PUT api/player/:playerId/edit
// @desc    Edit player data by ID
// access   Private
playerRouter.put(
  '/:playerId/edit',
  verifyToken,
  verifyId,
  validatePlayerEditFields,
  async (req: Request, res: Response) => {
    try {
      const result = await Player.updateOne(
        { _id: req.params.playerId },
        { ...req.body }
      );
      res.json(result);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// !! TEMPORARY WILL COMMENT OUT SOON !!
// !! @route   DELETE api/player/delete-all
// !! @desc    Delete all player documents
// !! access   Public
playerRouter.delete('/delete-all', async (req: Request, res: Response) => {
  try {
    await Player.deleteMany();
    res.status(200);
  } catch (err) {
    sendServerError(res, err);
  }
});

export default playerRouter;
