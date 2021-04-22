import mongoose from 'mongoose';
import { playerSchema } from './Player';
import { roundSchema } from './Round';
const { Schema, model } = mongoose;

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  password: {
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
});

const Game = model('Game', gameSchema);

export default Game;
