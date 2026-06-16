const rooms = {}
const socketRoomMap = {}
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

const getRoomState = (roomCode) => {
    return rooms[roomCode] || null
}

const updatePlayback = (roomCode, patch) => {
    Object.assign(rooms[roomCode].playback, patch)
}

const updateQueue = (roomCode, newQueue) => {
   return rooms[roomCode].queue = newQueue
}

module.exports = {addUserToRoom, removeUserBySocketId, getRoomState, updateQueue, updatePlayback}

