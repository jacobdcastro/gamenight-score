import { Schema, model, Types } from 'mongoose';
import { RoundPlayedSchema, roundPlayedSchema } from './RoundPlayed';
import { ID } from './types';

export interface PlayerSchema {
  name: string;
  userId: ID | string | null;
  status: string;
  avatar: {
    color: string;
    icon: string;
  };
  isGamemaster: boolean;
  gmCreated: boolean;
  deck: number;
  connected: boolean;
  totalScore: number;
  roundsPlayed: RoundPlayedSchema[] | [];
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
  status: {
    type: String,
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
  roundsPlayed: [roundPlayedSchema],
};

export const playerSchema = new Schema(playerSchemaFields);

const Player = model<PlayerDoc>('Player', playerSchema);

export default Player;
