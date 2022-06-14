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
var User = require('./user.js')
var Room = require('./room.js')

let game = null;
const port = 8080;

const rooms = {}
const users = {}

const duelQueue = []
const duelRooms = {}

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

  users[socket.id] = new User(socket.id);

  socket.on("create room", ( type, callback ) => {
    let roomId = null;
    if (users[socket.id].roomId !== null) {
      leaveRoom(socket, io);
    }
    roomId = "waiting";
    if (type === "random" && duelQueue.length === 0) {
      duelQueue.push(socket.id);
    } else {
      roomId = crypto.randomUUID();
      users[socket.id].setRoomId(roomId);

      if (type === "normal") {
        rooms[roomId] = new Room(roomId, type, socket.id);
        io.emit("room list update", getRoomsList());

      } else if (type === "random") {
        const player2 = duelQueue.pop();
        users[player2].setRoomId(roomId);
        rooms[roomId] = new Room(roomId, type, socket.id, player2);
          
        for (let i = 0; i < rooms[roomId].users.length; i++) {
          io.to(rooms[roomId].users[i]).emit('room found', roomId, rooms[roomId].players, rooms[roomId].game);
        }
      }
    }
    callback(roomId);
    
  });

  socket.on("start game", ( roomId ) => {
    if (roomId in rooms) {
      const room = rooms[roomId];
      const result = room.startGame(socket.id);
      if (result) {
        for (let i = 0; i < room.users.length; i++) {
          io.to(room.users[i]).emit('game state changed', room.game);
        }
      }
    }
  });

  socket.on("make move", ( roomId, bb, sb ) => {
    if (roomId in rooms) {
      const room = rooms[roomId];
      const result = room.makeMove(socket.id, bb, sb);
      if (result) {
        for (let i = 0; i < room.users.length; i++) {
          io.to(room.users[i]).emit('game state changed', room.game);
        }
      }
    }
  });

  socket.on("join room", ( roomId, callback ) => {
    let result = null;
    if (roomId in rooms) {
      result = roomId;
      const room = rooms[roomId];
      if (users[socket.id].roomId === null) {
        users[socket.id].setRoomId(roomId)
        room.joinRoom(socket.id);
        io.emit("room list update", getRoomsList());
      }
    }
    callback(result);
  });

  socket.on("pick side", ( roomId, side ) => {
    if (roomId in rooms) {
      const room = rooms[roomId];
      const result = room.pickSide(socket.id, side);
      if (result) {
        for (let i = 0; i < room.users.length; i++) {
          io.to(room.users[i]).emit('players state changed', room.players);
        }
      }
    }
  });

  socket.on("leave room", () => {
    leaveRoom(socket, io)
  });

  socket.on('disconnect', () => {
    let roomId = users[socket.id].roomId;
    if (roomId in rooms) {
      const room = rooms[roomId];
      const result = room.leaveRoom(socket.id);
      if (result === 0) {
        delete rooms[roomId];
        io.emit("room list update", getRoomsList());
      }
      delete users[socket.id];
    }
    console.log('user disconnected');
  });
})

const getRoomsList = () => {
  var roomsList = [];
  for (var key in rooms) {
    if (rooms.hasOwnProperty(key)) {
      if (rooms[key].type === "normal"){
        roomsList.push({
          id: key,
          player1: rooms[key].players[0],
          player2: rooms[key].players[1]
        });
      }
    }
  }
  return roomsList;
}

const leaveRoom = (socket, io) => {
  let roomId = users[socket.id].roomId;
  if (roomId in rooms) {
    const room = rooms[roomId];
    const result = room.leaveRoom(socket.id);
    if (result === 0) {
      delete rooms[roomId];
      io.emit("room list update", getRoomsList());
    }
    if (result === 3) {
      let winner;
      if (room.players[0] === null) {
        winner = 2;
      } else {
        winner = 1;
      }
      room.game.setWinner(winner);
      io.to(room.users[0]).emit('game state changed', room.game);
    }
    users[socket.id].resetRoomId();
  }
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})