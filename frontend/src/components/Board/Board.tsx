import axios from 'axios';
import { useEffect, useState } from 'react';
import './Board.css'

import SmallBoard from './SmallBoard';

interface Board {
    socket: any;
    room: any;
    setRoom: (value: null | string | ((prevState: null | string) => null | string)) => void;
    type: null | string;
    setType: (value: null | string | ((prevState: null | string) => null | string)) => void;
    board: number[][];
    setBoard: (value: number[][] | ((prevState: number[][]) => number[][])) => void;
    bigBoard: number[];
    setBigBoard: (value: number[] | ((prevState: number[]) => number[])) => void;
    players: null[] | string[];
    setPlayers: (value: null[] | string[] | ((prevState: null[] | string[]) => null[] | string[])) => void;
    turn: number;
    setTurn: (value: number | ((prevState: number) => number)) => void;
    nextMoves: number[];
    setNextMoves: (value: number[] | ((prevState: number[]) => number[])) => void;
    winner: number;
    setWinner: (value: number | ((prevState: number) => number)) => void;
}

export default function Board({ socket, room, setRoom, type, setType, board, setBoard, bigBoard, setBigBoard, players, setPlayers, turn, setTurn, nextMoves, setNextMoves, winner, setWinner }: Board) {

    function whatColor(id: number): string {
        if (nextMoves.includes(id)) {
            if (turn === 1) {
                return 'red-border';
            } else {
                return 'blue-border';
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

            setPlayers([null, null]);

            setBoard([[0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]])
            setBigBoard([0, 0, 0, 0, 0, 0, 0, 0, 0])
            setNextMoves([])
            setTurn(1)
            setWinner(0)

            setType(null);
        }
    }

    function pickSide(side: number): void {
        if (socket !== null) {
            socket.emit("pick side", room, side);
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

    useEffect(() => {
        if (socket !== null) {
            socket.on("players state changed", (...args: any) => {
                setPlayers(args[0]);
            });
        }
    }, [socket, setPlayers]);

    return (
        <div className='board'>
        {room === "waiting" ?
            <div>Waiting for oponent</div>
            :
            <div className='board'>
                <div>
                    {type === "normal" ?
                        <div>X:{players[0]} {(players[0] === socket.id) && "(you)"} O:{players[1]} {(players[1] === socket.id) && "(you)"}</div>
                        :
                        <div>{(players[turn-1] === socket.id) ? "Your" : "Opponent's"} turn</div>
                    }
                    {board.map((smallBoard, bb) => {
                        if (bigBoard[bb] === 0 || bigBoard[bb] === -1) {
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
                {(winner !== 0) &&
                    <div>
                    {winner === -1 ?
                        <div>
                            Draw
                        </div>
                            :
                        <div>You have {(players[winner-1] === socket.id) ? "won" : "lost"}</div>
                    }
                    </div>
                }
                <button onClick={() => leaveRoom()}>Leave room</button>
                {type === "normal" ?
                    <div>
                        <button onClick={() => startGame()}>Start game</button>
                        <button onClick={() => randomMove()}>Random Move</button>
                        <div>
                            {(players[0] === null || players[0] === socket.id) && <button onClick={() => pickSide(1)}>{(players[0] !== socket.id) ? "Pick " : "Unpick "} X</button>}
                            {(players[1] === null || players[1] === socket.id) && <button onClick={() => pickSide(2)}>{(players[1] !== socket.id) ? "Pick " : "Unpick "} O</button>}
                        </div>       
                    </div>
                    :
                    <div>
                        {winner !== 0 && <button onClick={() => createRoom("random")}>New random game</button>}
                    </div>
                }

            </div>
        }
        </div>
    );
}