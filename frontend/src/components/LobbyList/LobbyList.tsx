import { useState } from 'react';
import ILobbyItem from '../../types/ILobbyItem';

export default function LobbyList() {

    const [lobbyList, setLobbyList] = useState<Array<ILobbyItem>>([{id: "213423fewdf", user1: "fsdfsdfdsf", user2: "fesfsef"}])

    function joinGame(id: string): void {
        // join the game
    }

    return (
        <div>
            {lobbyList.map((elem) => {
                return (
                <div>
                    {elem.id} {elem.user1} {elem.user2}
                    <button onClick={() => joinGame(elem.id)}>Join game</button>
                </div>
                )
            })}
        </div>
    );
}