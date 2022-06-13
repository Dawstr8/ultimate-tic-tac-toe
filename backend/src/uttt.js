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
            turn = 1 + Math.floor(Math.random() * 2),
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
        if (this.winner === 0) {
            if (this.bigBoard[this.lastMove[1]] === 0) {
                nextMoves.push(this.lastMove[1])
            } else {
                for (let i = 0; i < 9; i += 1) {
                    if (this.bigBoard[i] === 0) {
                        nextMoves.push(i)
                    }
                }
            }
        }
        return nextMoves;
    }

    checkWinner(board) {
        const winningPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
        for (let i = 0; i < 8; i += 1) {
            let winningPosition = winningPositions[i];
            if (board[winningPosition[0]] === board[winningPosition[1]] && board[winningPosition[0]] === board[winningPosition[2]] && board[winningPosition[0]] !== 0 && board[winningPosition[0]] !== -1) {
                return board[winningPosition[0]];
            }
        }
        for (let i = 0; i < 9; i += 1) {
            if (board[i] === 0) {
                return 0;
            }
        }
        return -1;
    }

    makeMove(bb, sb) {
        if (this.winner === 0 && this.bigBoard[bb] === 0 && this.nextMoves.includes(bb) && this.board[bb][sb] === 0) {
            this.board[bb][sb] = this.turn;
            this.bigBoard[bb] = this.checkWinner(this.board[bb])
            this.winner = this.checkWinner(this.bigBoard)
            this.lastMove = [bb, sb]
            this.nextMoves = this.calculateNextMoves()
            this.turn = (this.turn % 2) + 1;
            if (this.winner === -1) {
                console.log(this.bigBoard);
                console.log(this.board)
            }
            return true;
        }
        return false;
    }
}