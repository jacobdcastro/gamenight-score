import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const playerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
});

const Player = model('Player', playerSchema);

export default Player;
