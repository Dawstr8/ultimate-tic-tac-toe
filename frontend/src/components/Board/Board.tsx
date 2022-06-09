import axios from 'axios';
import { useEffect, useState } from 'react';
import './Board.css'

import SmallBoard from './SmallBoard';

interface Board {
    socket: any;
    room: string;
    setRoom: (value: null | string | ((prevState: null | string) => null | string)) => void;
}


export default function Board({ socket, room, setRoom }: Board) {

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
        socket.emit("start game", room)
    }

    function makeMove(bb: number, sb: number): void {
        socket.emit("make move", room, bb, sb)
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

    useEffect(() => {
        if (socket !== null) {
            socket.on("game state changed", (...args: any) => {
                setBoard(args[0].board)
                setBigBoard(args[0].bigBoard)
                setNextMoves(args[0].nextMoves)
                setTurn(args[0].turn)
                setWinner(args[0].winner)
            });
        }
    }, [socket, setBoard, setBigBoard, setNextMoves, setTurn, setWinner]);

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