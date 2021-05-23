import { GameDoc } from '../models/Game';
import { RoundPlayedSchema } from '../models/RoundPlayed';
import { ID } from '../models/types';

type CorrectionFn = (game: GameDoc, playerId?: ID) => GameDoc;

export const orderPlayersByScore: CorrectionFn = (game) => {
  const playerArr = game.players;
  const correctedPlayerArr = playerArr.sort(
    (a, b) => a.totalScore + b.totalScore
  );
  game.players = correctedPlayerArr;
  return game;
};

export const orderRoundsByRoundNum: CorrectionFn = (game) => {
  const roundsArr = game.rounds;
  const correctedRoundsArr = roundsArr.sort(
    (a, b) => a.roundNumber - b.roundNumber
  );
  game.rounds = correctedRoundsArr;
  return game;
};

// reorders roundsPlayed[] by roundNum and corrects
// each round's totalScoreToRound
export const correctPlayerRoundsPlayed: CorrectionFn = (game, playerId) => {
  const player = game.players.id(playerId);
  const { roundsPlayed } = player;
  const correctedRoundsArr = roundsPlayed.sort(
    (a: RoundPlayedSchema, b: RoundPlayedSchema) => a.roundNum - b.roundNum
  );

  let totalScoreCounter = 0;

  for (let i = 0; i < roundsPlayed.length; i++) {
    const round = correctedRoundsArr[i];
    const total = totalScoreCounter + round.roundScore;
    correctedRoundsArr[i].totalScoreToRound = total;
    totalScoreCounter = total;
  }
  player.totalScore = totalScoreCounter;
  player.roundsPlayed = correctedRoundsArr;

  return game;
};
