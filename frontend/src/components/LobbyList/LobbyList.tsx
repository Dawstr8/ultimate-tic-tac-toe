import axios from 'axios';
import { useEffect, useState } from 'react';
import ILobbyItem from '../../types/ILobbyItem';
import './LobbyList.css'

interface LobbyList {
    socket: any;
    setRoom: (value: null | string | ((prevState: null | string) => null | string)) => void;
    setType: (value: null | string | ((prevState: null | string) => null | string)) => void;
    url: string;
}

export default function LobbyList({ socket, setRoom, setType, url } : LobbyList) {

    const [lobbyList, setLobbyList] = useState<Array<ILobbyItem>>([])

    function joinRoom(id: string): void {
        if (socket !== null) {
            socket.emit("join room", id, (response : string) => {
                if (response !== null) {
                    setType("normal");
                }
                setRoom(response);
            });
        }
    }

    function createRoom(type: string): void {
        if (socket !== null) {
            socket.emit("create room", type, (response : string) => {
                if (response !== null) {
                    setType(type);
                } 
                setRoom(response);
            });
        }
    }

    useEffect(() => {
        function getRoomsList(): void {
            axios.get(url + '/getRoomsList')
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
        <div className='list'>
            <div>
                {lobbyList.map((elem) => {
                    return (
                    <div className='lobby-item'>
                        <div className='lobby-item-text'>{elem.id}</div>
                        <button onClick={() => joinRoom(elem.id)}>Join room</button>
                    </div>
                    )
                })}
                <button className='center-button' onClick={() => createRoom("normal")}>Create room</button>
                <button className='center-button' onClick={() => createRoom("random")}>Join random game</button>
            </div>
        </div>
    );
}