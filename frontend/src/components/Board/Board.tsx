import axios from 'axios';
import { useState } from 'react';
import './Board.css'

import SmallBoard from './SmallBoard';

interface Board {
    socket: any;
    setRoom: (value: null | string | ((prevState: null | string) => null | string)) => void;
}


export default function Board({ socket, setRoom }: Board) {

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

    const [nextMoves, setNextMoves] = useState<number[]>([]);
    const [turn, setTurn] = useState<number>(1);
    const [winner, setWinner] = useState<number>(0)

    function whatColor(id: number): string {
        if (nextMoves.includes(id)) {
            if (turn === 1) {
                return 'red';
            } else {
                return 'blue';
            }
        } else {
            return '';
        }
    }

    function startGame(): void {
        axios.get('http://localhost:8080/startGame')
        .then((response) => {
            setBoard(response.data.board)
            setBigBoard(response.data.bigBoard)
            setNextMoves(response.data.nextMoves)
            setTurn(response.data.turn)
            setWinner(response.data.winner)
            console.log(response.data);
        });
    }

    function makeMove(bb: number, sb: number): void {
        axios.get('http://localhost:8080/makeMove', {params: { bb: String(bb), sb: String(sb) }})
        .then((response) => {
            setBoard(response.data.board)
            setBigBoard(response.data.bigBoard)
            setNextMoves(response.data.nextMoves)
            setTurn(response.data.turn)
            setWinner(response.data.winner)
        });
    }

    function randomMove(): void {
        let bb = nextMoves[Math.floor(Math.random()*nextMoves.length)]
        let sb = Math.floor(Math.random()*9)
        while (board[bb][sb] !== 0) {
            sb = Math.floor(Math.random()*9)
        }
        makeMove(bb, sb)
    }

    function leaveRoom(): void {
        if (socket !== null) {
            socket.emit("leave room");
            setRoom(null)
        }
    }

    return (
        <div className='board'>
            <div>
            {board.map((smallBoard, bb) => {
                if (bigBoard[bb] === 0 || bigBoard[bb] === 2) {
                    return (
                        <SmallBoard bb={bb} smallBoard={smallBoard} makeMove={makeMove} color={whatColor(bb)}/>
                    )
                } else if (bigBoard[bb] === 1) {
                    return (
                        <div className='small-board big-field field-x'>X</div>
                    )
                } else {
                    return (
                        <div className='small-board big-field field-o'>O</div>
                    )
                }
            })}
            </div>
            {winner === 1 && <div>The winner is X</div>}
            {winner === -1 && <div>The winner is O</div>}
            {winner === 2 && <div>Draw</div>}
            <button onClick={() => startGame()}>Start game</button>
            <button onClick={() => randomMove()}>Random Move</button>
            <button onClick={() => leaveRoom()}>Leave room</button>
            
        </div>
    );
}