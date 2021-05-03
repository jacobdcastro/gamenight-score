import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import {
  validatePlayerEditFields,
  validateUserIdParam,
  validateUsernameAndPassword,
} from '../../middleware/validator';
import { User } from '../../models';
import { UserSchema } from '../../models/User';
import { sendServerError } from '../../utils/errors';
import { verifyToken, verifyUserId } from '../../middleware/auth';

const userRouter = express.Router();

const secret: string = config.get('jwtsecret');

// @route   POST api/user/signup
// @desc    Create new user account
// access   Public
userRouter.post(
  '/signup',
  validateUsernameAndPassword,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // check if username is taken
    const userWithSameUsername = await User.findOne({ username });
    if (userWithSameUsername) {
      return res.status(400).json({ errors: [{ msg: 'Username taken' }] });
    }

    const userData: UserSchema = {
      username,
      password,
      gamesPlayed: [],
    };

    try {
      // hash password asyncronously
      const hash = await bcrypt.hash(password, 14);
      userData.password = hash;

      // create and save new user in DB
      const user = new User(userData);
      await user.save();

      // create and send token
      jwt.sign(
        { userId: user.id },
        secret,
        { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
        (err, token) => {
          if (err) sendServerError(res, err);
          else res.json({ token, user });
        }
      );
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   POST api/user/signup
// @desc    Login to user account
// access   Public
userRouter.post(
  '/login',
  validateUsernameAndPassword,
  async (req: Request, res: Response) => {
    try {
      // find user document
      const user = await User.findOne({ username: req.body.username });

      // if user doesn't exist, send error, prompt sign up
      if (!user) {
        res
          .status(400)
          .send("Username doesn't exist, would you like to sign up?");
      } else {
        // check if password in body matches password in DB
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
          jwt.sign(
            { userId: user.id },
            secret,
            { algorithm: 'HS256', expiresIn: 60 * 60 * 6 },
            (err, token) => {
              if (err) sendServerError(res, err);
              else res.json({ token, user });
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

// @route   GET api/user/:userId
// @desc    Get user data by ID
// access   Public
userRouter.get(
  '/:userId',
  validateUserIdParam,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId);
      res.json(user);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// @route   PUT api/user/:userId/edit
// @desc    Edit user data by ID
// access   Private
userRouter.put(
  '/:userId/edit',
  verifyToken,
  verifyUserId,
  validatePlayerEditFields,
  async (req: Request, res: Response) => {
    try {
      const result = await User.updateOne(
        { _id: req.params.userId },
        { ...req.body }
      );
      res.json(result);
    } catch (err) {
      sendServerError(res, err);
    }
  }
);

// !! TEMPORARY WILL COMMENT OUT SOON !!
// !! @route   DELETE api/user/delete-all
// !! @desc    Delete all user documents
// !! access   Public
userRouter.delete('/delete-all', async (req: Request, res: Response) => {
  try {
    await User.deleteMany();
    res.status(200);
  } catch (err) {
    sendServerError(res, err);
  }
});

export default userRouter;
