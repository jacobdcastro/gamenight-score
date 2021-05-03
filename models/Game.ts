import { Document, Schema, model } from 'mongoose';
import { PlayerDoc, playerSchema } from './Player';
import { RoundDoc, RoundSchema, roundSchema } from './Round';

export interface GameSchema {
  passcode: string;
  players: PlayerDoc[];
  maxNumberOfRounds: number;
  currentRound: any;
  rounds: RoundDoc[];
  hideScores: boolean;
  dateCreated: Date;
  startTime: Date | null;
  endTime: Date | null;
  expired: boolean;
}

interface GameDoc extends GameSchema, Document {}

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
    type: Schema.Types.ObjectId,
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
