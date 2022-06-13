var UltimateTicTacToe = require('./uttt.js')

module.exports = class Room {
    constructor(roomId, creator){
        this.roomId = roomId;
        this.users = [creator];
        this.players = [];
        this.game = null;
        this.roomEmpty = false;
    }

    startGame(userId) {
        let players = this.players;
        if (players[0] !== null && players[1] !== null && (userId === players[0] || userId === players[1])) {
            this.game = new UltimateTicTacToe();
            return true;
        }
        return false;
    }

    makeMove(player, bb, sb) {
        let players = this.players;
        let turn = this.game.turn;
        if (players[0] !== null && players[1] !== null) {
            if ((turn === -1 && player === players[0]) || (turn === 1 && player === players[1])) {
                return this.game.makeMove(bb, sb);
            }
        }
        return false;
    }

    joinRoom(userId) {
        this.users.push(userId);
        this.roomEmpty = false;
    }

    leaveRoom(userId) {
        if (this.players[0] == userId) {
            this.players[0] = null;
        } else if (this.players[1] == userId) {
            this.players[1] = null;
        }

        this.users = this.users.filter((id) => userId !== user);
        if (this.users.length == 0) {
            this.roomEmpty = true;
        }

        if (this.players[0] === null && this.players[1] === null) {
            this.gameEmpty = true;
        }
    }

    //pickSide()
}