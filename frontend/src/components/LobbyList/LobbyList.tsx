import axios from 'axios';
import { useEffect, useState } from 'react';
import ILobbyItem from '../../types/ILobbyItem';

interface LobbyList {
    socket: any;
    setRoom: (value: null | string | ((prevState: null | string) => null | string)) => void;
}

export default function LobbyList({ socket, setRoom } : LobbyList) {

    const [lobbyList, setLobbyList] = useState<Array<ILobbyItem>>([])

    function joinRoom(id: string): void {
        if (socket !== null) {
            socket.emit("join room", id, (response : string) => {
                setRoom(response);
            });
        }
    }

    function createRoom(): void {
        if (socket !== null) {
            socket.emit("create room", (response : string) => {
                setRoom(response);
            });
        }
    }

    useEffect(() => {
        function getRoomsList(): void {
            axios.get('http://localhost:8080/getRoomsList')
            .then((response) => {
                setLobbyList(response.data)
            });
        }
        getRoomsList();
    }, []);

    useEffect(() => {
        if (socket !== null) {
            socket.on("room list update", (...args: any) => {
                setLobbyList(args[0]);
            });
        }
    }, [socket, setLobbyList]);
 

    return (
        <div>
            {lobbyList.map((elem) => {
                return (
                <div>
                    {elem.id} {elem.player1} {elem.player2}
                    <button onClick={() => joinRoom(elem.id)}>Join room</button>
                </div>
                )
            })}
            <button onClick={() => createRoom()}>Create room</button>
        </div>
    );
}