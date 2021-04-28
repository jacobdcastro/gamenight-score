# gamenight-score

Dutch Blitz scorekeepiing app to sync the scoreboard to multiple devices.

## UX Order

1. gamemaster clicks "create new game button"
2. gamemaster signs up (either w/ email or skips, continues as guest)
3. gamemaster sets up and creates new game
4. gamemaster arrives at lobby w/ invite code
5. player clicks "join game"
6. player signs up (either w/ email or skips, continues as guest)
7. player enters invite code
8. player arrives at lobby
9. gm starts round
10. _play commences irl_
11. gm ends round
12. gm chooses winner
13. all players enter scores
14. once all players enter scores, next round automatically initializes
15. gm starts next round
16. once all rounds have ended, and all players have entered their scores for final round, game ends and data is read-only

## Signup Order

1. submit username, password
2. username, password (encrypted) added to database as new user
3. jwt signed w/ user { userId, isGamemaster }
4. jwt returned to client and stored in localstorage
5. redirected to private "create game" route OR redirected to private "enter invite code" route
6. once game is created, new jwt signed w/ payload { userId, isGamemaster, gameId }
7. redirected to private in-game lobby

## API Endpoints

### v1 endpoints

- GET get game by id
- POST Create game (gm)
- POST Create authenticated user
- POST Create guest user (gm)
- POST (user) join game
- POST start round (gm)
- POST next phase (auto)
- POST end round (gm)
- POST set round winner (gm)
- POST submit player score
- PUT edit player score (gm)
- POST next round/ new round? (gm)
- POST end game (gm)

## v2 endpoints

- PUT set avatar
- POST post chatroom message
- POST post player message

## Feature notes

- game chat room
- player comments
- player avatar (color, icons)
- add new player beginning score option, gamemaster decides "start at 0" or "start at players' scores' average"
- circle chart (larger circles, higher number, red negative, green positive)
