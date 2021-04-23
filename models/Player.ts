import { Document, Schema, model } from 'mongoose';

interface PlayerSchema {
  name: string;
  email: string;
  password: string;
  gmCreated: boolean;
  color: string;
  icon: string;
}

export interface PlayerDoc extends PlayerSchema, Document {}

const playerSchemaFields: Record<keyof PlayerSchema, any> = {
  name: {
    type: String,
    required: true,
  },
  email: {
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
};

export const playerSchema = new Schema(playerSchemaFields);

const Player = model<PlayerDoc>('Player', playerSchema);

export default Player;
