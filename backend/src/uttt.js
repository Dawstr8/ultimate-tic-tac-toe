class UltimateTicTacToe {
    constructor() {
        this.bigBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.nextMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.lastMove = null;
        this.turn = Math.pow(-1, [Math.floor(Math.random() * 2)]);
        this.winner = 0;
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
        if (this.winner === 0 && nextMoves.includes(bb) && this.board[bb][sb] === 0) {
            this.board[bb][sb] = turn;
            this.bigBoard[bb] = checkWinner(board[bb])
            this.winner = checkWinner(bigBoard)
        }
    }
}