import { Schema, model, Types } from 'mongoose';
import { ID } from './types';

export interface RoundPlayedSchema {
  round: ID;
  roundNum: number;
  roundScore: number;
  totalScoreToRound: number;
}

export interface RoundPlayedDoc extends RoundPlayedSchema, Types.Subdocument {}

const roundPlayedSchemaFields: Record<keyof RoundPlayedSchema, any> = {
  round: { type: Schema.Types.ObjectId, ref: 'Round' },
  roundNum: { type: Number },
  roundScore: { type: Number },
  totalScoreToRound: { type: Number },
};

export const roundPlayedSchema = new Schema(roundPlayedSchemaFields);

const RoundPlayed = model<RoundPlayedDoc>('RoundPlayed', roundPlayedSchema);

export default RoundPlayed;
