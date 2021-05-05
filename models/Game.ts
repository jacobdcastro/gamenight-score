import { Document, Schema, model, Types } from 'mongoose';
import { PlayerDoc, playerSchema } from './Player';
import { RoundDoc, roundSchema } from './Round';

export interface GameSchema {
  passcode: string;
  players: Types.DocumentArray<PlayerDoc>;
  maxNumberOfRounds: number;
  currentRound: any;
  rounds: Types.DocumentArray<RoundDoc>;
  hideScores: boolean;
  dateCreated: Date;
  startTime: Date | null;
  endTime: Date | null;
  expired: boolean;
}

export interface GameDoc extends GameSchema, Document {}

const gameSchemaFields: Record<keyof GameSchema, any> = {
  passcode: {
    type: String,
    required: true,
  },
  players: [playerSchema],
  maxNumberOfRounds: {
    type: Number,
    default: null,
  },
  currentRound: {
    type: Types.ObjectId,
    ref: 'Round',
  },
  rounds: [roundSchema], // subdoc
  hideScores: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  expired: {
    type: Boolean,
  },
};

const gameSchema = new Schema(gameSchemaFields);

const Game = model<GameDoc>('Game', gameSchema);

export default Game;
