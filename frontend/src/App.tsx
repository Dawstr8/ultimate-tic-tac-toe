import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Board from './components/Board/Board';
import LobbyList from './components/LobbyList/LobbyList';

function App() {

  const [socket, setSocket] = useState<any>(null)
  const [room, setRoom] = useState<null | string>(null)

  useEffect(() => {
    const newSocket = io(`http://localhost:8080`, { transports: ['websocket'] });

    setSocket(newSocket);
    return () => { newSocket.disconnect() };
  }, [setSocket]);

  return (
    <div className="bg">
      {room === null?
        <LobbyList setRoom={setRoom} socket={socket}/>
        :
        <Board room={room} setRoom={setRoom} socket={socket}/>
      }      
    </div>
  );
}

export default App;
