import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/default.env' });

import express from 'express';
import connectDB from './config/db';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import mongoose from 'mongoose';
import { userRouter, gameRouter, playerRouter, roundRouter } from './routes';

const PORT = process.env.PORT;

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/api/user', userRouter);
app.use('/api/game', gameRouter);
app.use('/api/player', playerRouter);
app.use('/api/round', roundRouter);

// // point to static folder
// app.use(express.static(path.join(__dirname, 'client', 'build')));

// // Catch all routes to index.html in react app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

// Once mongo database is open, start listening at port
// and connect the db collection to pusher to watch for changes
const db = mongoose.connection;

db.once('open', () => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
