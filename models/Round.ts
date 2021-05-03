import { Document, Schema, model } from 'mongoose';
import { ID } from './types';

export interface RoundSchema {
  roundNumber: number;
  startTime: Date | null;
  endTime: Date | null;
  winner: ID | null;
  playerScores: [];
  inProgress: boolean;
  finished: boolean;
  allGmPlayersScoresSubmitted: boolean;
  allScoresSubmitted: boolean;
  newRoundReady: boolean;
}

export interface RoundDoc extends RoundSchema, Document {}

const roundSchemaFields: Record<keyof RoundSchema, any> = {
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
};

export const roundSchema = new Schema(roundSchemaFields);

const Round = model<RoundDoc>('Round', roundSchema);

export default Round;
