module.exports = class UltimateTicTacToe {
    constructor(
            bigBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0],
            board=[
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]],
            nextMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8],
            lastMove = null,
            turn = Math.pow(-1, [Math.floor(Math.random() * 2)]),
            winner = 0) {
        this.bigBoard = bigBoard;
        this.board = board;
        this.nextMoves = nextMoves;
        this.lastMove = lastMove;
        this.turn = turn;
        this.winner = winner;
    }

    calculateNextMoves() {
        let nextMoves = []
        if (this.bigBoard[this.lastMove[1]] === 0) {
            nextMoves.push(this.lastMove[1])
        } else {
            for (let i = 0; i < 9; i += 1) {
                if (this.bigBoard[i] === 0) {
                    nextMoves.push(i)
                }
            }
        }

        return nextMoves
    }

    checkWinner(board) {
        const winningPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
        for (const winningPosition in winningPositions) {
            if (board[winningPosition[0]] === board[winningPosition[1]] && board[winningPosition[0]] === board[winningPosition[2]] && board[winningPosition[0]] !== 0) {
                return board[winningPosition[0]];
            }
        }
        return 0;
    }

    makeMove(bb, sb) {
        let nbb = parseInt(bb)
        let nsb = parseInt(sb)

        if (this.winner === 0 && this.bigBoard[bb] === 0 && this.nextMoves.includes(nbb) && this.board[nbb][nsb] === 0) {
            this.board[nbb][nsb] = this.turn;
            this.bigBoard[nbb] = this.checkWinner(this.board[nbb])
            this.winner = this.checkWinner(this.bigBoard)
            this.lastMove = [nbb, nsb]
            this.nextMoves = this.calculateNextMoves()
            this.turn *= -1;
        }

        return {
            winner: this.winner,
            board: this.board,
            bigBoard: this.bigBoard,
            lastMove: this.lastMove,
            nextMoves: this.nextMoves,
            turn: this.turn
        }
    }
}