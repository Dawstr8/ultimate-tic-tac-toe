import axios from 'axios';
import { useState } from 'react';
import './Board.css'

import SmallBoard from './SmallBoard';

export default function Board() {

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
            console.log(response.data);
        });
    }

    return (
        <div className='board'>
            {board.map((smallBoard, bb) => {
                return (
                    <SmallBoard bb={bb} smallBoard={smallBoard} makeMove={makeMove} color={whatColor(bb)}/>
                )
            })}
            <button onClick={() => startGame()}>Start game</button>
        </div>
    );
}