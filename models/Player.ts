import { Document, Schema, model } from 'mongoose';
import { ID } from './types';

export interface PlayerSchema {
  name: string;
  username: string;
  password: string;
  gmCreated: boolean;
  color: string;
  icon: string;
  gamesPlayed: ID[];
}

export interface PlayerDoc extends PlayerSchema, Document {}

const playerSchemaFields: Record<keyof PlayerSchema, any> = {
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gmCreated: {
    type: Boolean,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  gamesPlayed: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
};

export const playerSchema = new Schema(playerSchemaFields);

const Player = model<PlayerDoc>('Player', playerSchema);

export default Player;
