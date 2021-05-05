import { Document, Schema, model, Types } from 'mongoose';
import { ID } from './types';

export interface PlayerSchema {
  name: string;
  userId: ID | string | null;
  avatar: {
    color: string;
    icon: string;
  };
  isGamemaster: boolean;
  gmCreated: boolean;
  deck: number;
  connected: boolean;
  totalScore: number;
  roundsPlayed:
    | {
        round: ID;
        roundNumber: number;
        roundScore: number;
        totalScoreToRound: number;
      }[]
    | [];
}

export interface PlayerDoc extends PlayerSchema, Types.Subdocument {}

const playerSchemaFields: Record<keyof PlayerSchema, any> = {
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isGamemaster: {
    type: Boolean,
    required: true,
  },
  gmCreated: {
    type: Boolean,
    required: true,
  },
  deck: {
    type: Number,
  },
  avatar: {
    color: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
  },
  connected: {
    type: Boolean,
  },
  totalScore: {
    type: Number,
  },
  roundsPlayed: [
    {
      round: Schema.Types.ObjectId,
      roundNumber: { type: Number },
      roundScore: { type: Number },
      totalScoreToRound: { type: Number },
    },
  ],
};

export const playerSchema = new Schema(playerSchemaFields);

const Player = model<PlayerDoc>('Player', playerSchema);

export default Player;
