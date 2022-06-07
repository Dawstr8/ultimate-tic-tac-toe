const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors')
app.use(cors());
const io = new Server(server);

const crypto = require('crypto')

var UltimateTicTacToe = require('./uttt.js')

let game = null;
const port = 8080;

const rooms = {}
const users = {}

const getRoomsList = () => {
  var roomsList = [];
  for (var key in rooms) {
    if (rooms.hasOwnProperty(key)) {
      roomsList.push({
        id: key,
        player1: rooms[key].players[0],
        player2: rooms[key].players[1]
      });
    }
  }
  return roomsList;
}

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

app.get('/getRoomsList', (req, res) => {
  res.send(getRoomsList())
})

io.on('connection', (socket) => {
  console.log('a user connected')

  users[socket.id] = {
    roomId: null
  }

  socket.on("create room", ( callback ) => {
    if (users[socket.id].roomId === null) {
      const roomId = crypto.randomUUID()
      users[socket.id].roomId = roomId
      rooms[roomId] = {
        players: [socket.id, null],
        game: new UltimateTicTacToe()
      }
      
      io.emit("room list update", getRoomsList());
      callback(roomId)
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})