module.exports = class User {
    constructor(id){
        this.id = id;
        this.roomId = null;
    }

    setRoomId(roomId) {
        this.roomId = roomId;
    }

    resetRoomId() {
        this.roomId = null;
    }
}