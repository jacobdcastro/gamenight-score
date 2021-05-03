import { Document, Schema, model } from 'mongoose';
import { ID } from './types';

export interface UserSchema {
  username: string;
  password: string;
  gamesPlayed: ID[];
}

export interface UserDoc extends UserSchema, Document {}

const userSchemaFields: Record<keyof UserSchema, any> = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gamesPlayed: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
};

export const userSchema = new Schema(userSchemaFields);

const User = model<UserDoc>('User', userSchema);

export default User;
