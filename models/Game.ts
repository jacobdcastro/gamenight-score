import { Document, Schema, model } from 'mongoose';
import { PlayerDoc } from './Player';
import { roundSchema } from './Round';
import { ID } from './types';

interface GameSchema {
  title: string;
  passcode: string;
  players: ID[] | PlayerDoc[];
  maxNumberOfRounds: number;
  currentRound: any;
  rounds: ID[] | PlayerDoc[];
  hideScores: boolean;
  startTime: Date;
  endTime: Date;
  expired: boolean;
}

interface GameDoc extends GameSchema, Document {}

const gameSchemaFields: Record<keyof GameSchema, any> = {
  title: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  players: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
      isGamemaster: {
        type: Boolean,
        required: true,
      },
      deck: {
        type: String,
      },
      connected: {
        type: Boolean,
        required: true,
      },
      roundsPlayed: [
        {
          round: {
            type: Schema.Types.ObjectId,
            ref: 'Round',
          },
          roundNumber: {
            type: Number,
            required: true,
          },
          roundScore: {
            type: Number,
            required: true,
          },
          totalScoreToRound: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  maxNumberOfRounds: {
    type: Number,
    default: null,
  },
  currentRound: {
    type: Schema.Types.ObjectId,
    ref: 'Round',
  },
  rounds: [roundSchema],
  hideScores: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: Date.now,
  },
  expired: {
    type: Boolean,
  },
};

const gameSchema = new Schema(gameSchemaFields);

const Game = model<GameDoc>('Game', gameSchema);

export default Game;
