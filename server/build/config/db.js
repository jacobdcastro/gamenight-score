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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const NODE_ENV = process.env.NODE_ENV;
const key = NODE_ENV === 'production' ? 'mongoURIProd' : 'mongoURIDev';
const db = config_1.default.get(key);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`⚡️ Successfully connected to MongoDB database: '${NODE_ENV}'`);
    }
    catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
});
exports.default = connectDB;
