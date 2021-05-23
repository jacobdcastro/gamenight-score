"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const validator_1 = require("../../middleware/validator");
const models_1 = require("../../models");
const errors_1 = require("../../utils/errors");
const auth_1 = require("../../middleware/auth");
const userRouter = express_1.default.Router();
const secret = config_1.default.get('jwtsecret');
// @route   POST api/user/signup
// @desc    Create new user account
// access   Public
userRouter.post('/signup', validator_1.validateUsernameAndPassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // check if username is taken
    const userWithSameUsername = yield models_1.User.findOne({ username });
    if (userWithSameUsername) {
        return res.status(400).json({ errors: [{ msg: 'Username taken' }] });
    }
    const userData = {
        username,
        password,
        gamesPlayed: [],
    };
    try {
        // hash password asyncronously
        const hash = yield bcrypt_1.default.hash(password, 14);
        userData.password = hash;
        // create and save new user in DB
        const user = new models_1.User(userData);
        yield user.save();
        // create and send token
        jsonwebtoken_1.default.sign({ userId: user.id }, secret, { algorithm: 'HS256', expiresIn: 60 * 60 * 6 }, (err, token) => {
            if (err)
                errors_1.sendServerError(res, err);
            else
                res.json({ token, user });
        });
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   POST api/user/signup
// @desc    Login to user account
// access   Public
userRouter.post('/login', validator_1.validateUsernameAndPassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find user document
        const user = yield models_1.User.findOne({ username: req.body.username });
        // if user doesn't exist, send error, prompt sign up
        if (!user) {
            res
                .status(400)
                .send("Username doesn't exist, would you like to sign up?");
        }
        else {
            // check if password in body matches password in DB
            const isMatch = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (isMatch) {
                jsonwebtoken_1.default.sign({ userId: user.id }, secret, { algorithm: 'HS256', expiresIn: 60 * 60 * 6 }, (err, token) => {
                    if (err)
                        errors_1.sendServerError(res, err);
                    else
                        res.json({ token, user });
                });
            }
            else {
                res.status(400).send('Incorrect password');
            }
        }
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   GET api/user/:userId
// @desc    Get user data by ID
// access   Public
userRouter.get('/:userId', validator_1.validateUserIdParam, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById(req.params.userId);
        res.json(user);
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// @route   PUT api/user/:userId/edit
// @desc    Edit user data by ID
// access   Private
userRouter.put('/:userId/edit', auth_1.verifyToken, auth_1.verifyUserId, validator_1.validatePlayerEditFields, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.User.updateOne({ _id: req.params.userId }, Object.assign({}, req.body));
        res.json(result);
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
// !! TEMPORARY WILL COMMENT OUT SOON !!
// !! @route   DELETE api/user/delete-all
// !! @desc    Delete all user documents
// !! access   Public
userRouter.delete('/delete-all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.User.deleteMany();
        res.status(200);
    }
    catch (err) {
        errors_1.sendServerError(res, err);
    }
}));
exports.default = userRouter;
