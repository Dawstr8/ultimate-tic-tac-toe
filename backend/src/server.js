const express = require('express');
var cors = require('cors')
const app = express();
const port = 8080;

app.use(cors())

var UltimateTicTacToe = require('./uttt.js')

let game = null;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/startGame', (req, res) => {
  game = new UltimateTicTacToe();
  res.send(
    {
      board: game.board,
      nextMoves: game.nextMoves,
      bigBoard: game.bigBoard,
      turn: game.turn,
      winner:game.winner
    });
})

app.get('/makeMove', (req, res) => {

  game.makeMove(parseInt(req.query.bb), parseInt(req.query.sb))

  res.send(
    {
      winner: game.winner,
      board: game.board,
      bigBoard: game.bigBoard,
      lastMove: game.lastMove,
      nextMoves: game.nextMoves,
      turn: game.turn
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})