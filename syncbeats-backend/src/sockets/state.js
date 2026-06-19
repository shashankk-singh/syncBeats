const rooms = {}
const socketRoomMap = {} //maps socketId --> roomCode
const addUserToRoom = (roomCode, userObj) => {
   
    if(!rooms[roomCode]){
       rooms[roomCode] = { users: [], playback: {videoId: null, timestamp: 0, isPlaying: false}, queue: [] }  //if room does not exist define here 
    }
    rooms[roomCode].users.push(userObj)
    socketRoomMap[userObj.socketId] = roomCode
}

const removeUserBySocketId = (socketId) => {
    const roomCode = socketRoomMap[socketId]
    if(!roomCode){
        return null
    }
    rooms[roomCode].users = rooms[roomCode].users.filter(u => u.socketId !== socketId) //filter the array to remove the user left

    if(rooms[roomCode].users.length == 0){
        delete rooms[roomCode]
    }
    delete socketRoomMap[socketId]

    return roomCode
}

const getRoomCodeBySocketId = (socketId) => {
    return socketRoomMap[socketId] || null
}

const getRoomState = (roomCode) => {
    return rooms[roomCode] || null
}

const updatePlayback = (roomCode, patch) => {
    const room = rooms[roomCode]
    if(!room){
        return
    }
    Object.assign(room.playback, patch)
}

const updateQueue = (roomCode, newQueue) => {
    const room = rooms[roomCode]
    if(!room){
        return
    }
   return room.queue = newQueue
}

module.exports = {addUserToRoom, removeUserBySocketId, getRoomState, updateQueue, updatePlayback, getRoomCodeBySocketId}

