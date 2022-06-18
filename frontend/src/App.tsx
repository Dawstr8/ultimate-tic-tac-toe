import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Board from './components/Board/Board';
import LobbyList from './components/LobbyList/LobbyList';

function App() {

  const [socket, setSocket] = useState<any>(null);
  const [room, setRoom] = useState<null | string>(null);
  const [type, setType] = useState<null | string>(null);
  const url = "https://still-stream-09690.herokuapp.com/";
  //const url = "http://localhost:8080"


  useEffect(() => {
    const newSocket = io(url, { transports: ['websocket'] });

    setSocket(newSocket);
    return () => { newSocket.disconnect() };
  }, [setSocket]);

  return (
    <div className="bg">
      {(room === null)?
        <LobbyList
          setRoom={setRoom}
          setType={setType}
          socket={socket}
          url={url}/>
        :
        <Board
          room={room} setRoom={setRoom} 
          type={type} setType={setType}
          socket={socket}
          url={url}
          />
      }      
    </div>
  );
}

export default App;
