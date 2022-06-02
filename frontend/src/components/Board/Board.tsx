import { useState } from 'react';
import './Board.css'

import SmallBoard from './SmallBoard';

export default function Board() {

    const [board, setBoard] = useState<number[][]>(
       [[1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]);

    const [nextMoves, setNextMoves] = useState<number[]>([0, 2, 5]);
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

    return (
        <div className='board'>
            {board.map((smallBoard, id) => {
                return (
                    <SmallBoard smallBoard={smallBoard} color={whatColor(id)}/>
                )
            })}
        </div>
    );
}