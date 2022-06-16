import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Board from './components/Board/Board';
import LobbyList from './components/LobbyList/LobbyList';

function App() {

  const [socket, setSocket] = useState<any>(null);
  const [room, setRoom] = useState<null | string>(null);
  const [type, setType] = useState<null | string>(null);

  const [board, setBoard] = useState<number[][]>(
    [[0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0, 0]]);

 const [bigBoard, setBigBoard] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0])
 const [players, setPlayers] = useState<null[] | string[]>([null, null])

 const [nextMoves, setNextMoves] = useState<number[]>([]);
 const [turn, setTurn] = useState<number>(1);
 const [winner, setWinner] = useState<number>(0)

  useEffect(() => {
    const newSocket = io(`http://localhost:8080`, { transports: ['websocket'] });

    setSocket(newSocket);
    return () => { newSocket.disconnect() };
  }, [setSocket]);

  useEffect(() => {
    if (socket !== null) {
        socket.on("room found", (...args: any) => {
            setRoom(args[0]);

            setPlayers(args[1]);

            setBoard(args[2].board)
            setBigBoard(args[2].bigBoard)
            setNextMoves(args[2].nextMoves)
            setTurn(args[2].turn)
            setWinner(args[2].winner)

            setType("random");
        });
    }
  }, [socket, setRoom, setPlayers, setBoard, setBigBoard, setNextMoves, setTurn, setWinner, setType]);

  function getGameInfo(roomId: string): void {
    axios.get('http://localhost:8080/getGameInfo', { params: { roomId: roomId } })
    .then((response) => {
        setBoard(response.data.board)
        setBigBoard(response.data.bigBoard)
        setNextMoves(response.data.nextMoves)
        setTurn(response.data.turn)
        setWinner(response.data.winner)
    });
  }

  function getPlayersInfo(roomId: string): void {
    axios.get('http://localhost:8080/getPlayersInfo', { params: { roomId: roomId } })
    .then((response) => {
        setPlayers(response.data.players);
    });
  }

  return (
    <div className="bg">
      {(room === null)?
        <LobbyList getGameInfo={getGameInfo} getPlayersInfo={getPlayersInfo} setRoom={setRoom} setType={setType} socket={socket}/>
        :
        <Board
          room={room} setRoom={setRoom} 
          type={type} setType={setType}
          board={board} setBoard={setBoard}
          bigBoard={bigBoard} setBigBoard={setBigBoard}
          players={players} setPlayers={setPlayers}
          turn={turn} setTurn={setTurn}
          nextMoves={nextMoves} setNextMoves={setNextMoves}
          winner={winner} setWinner={setWinner}
          socket={socket}
          />
      }      
    </div>
  );
}

export default App;
