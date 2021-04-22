import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const roundSchema = new Schema({
  roundNumber: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: Date.now,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  playerScores: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
      roundScore: {
        type: Number,
        required: true,
      },
    },
  ],
  inProgress: {
    type: Boolean,
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
  },
  allGmPlayersScoresSubmitted: {
    type: Boolean,
    required: true,
  },
  allScoresSubmitted: {
    type: Boolean,
    required: true,
  },
  newRoundReady: {
    type: Boolean,
    required: true,
  },
});

const Round = model('Round', roundSchema);

export default Round;
