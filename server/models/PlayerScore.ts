import { Schema, model, Types } from 'mongoose';
import { ID } from './types';

export interface PlayerScoreSchema {
  player: ID | string;
  roundScore: number;
}

export interface PlayerScoreDoc extends PlayerScoreSchema, Types.Subdocument {}

const playerScoreSchemaFields: Record<keyof PlayerScoreSchema, any> = {
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  roundScore: {
    type: Number,
    required: true,
  },
};

export const playerScoreSchema = new Schema(playerScoreSchemaFields);

const PlayerScore = model<PlayerScoreDoc>('PlayerScore', playerScoreSchema);

export default PlayerScore;
