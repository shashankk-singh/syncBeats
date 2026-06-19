const {addUserToRoom, removeUserBySocketId, getRoomState,
 updateQueue, updatePlayback,getRoomCodeBySocketId
} = require('../state')

const Rooms = require('../../models/room')
const User = require('../../models/user')

const joinRoom = async (socket, roomCode) => {
    const room = await Rooms.findOne({code: roomCode})
    if(!room){
        socket.emit('room-error', { message: 'Room not found' })
        return
    }
    const user = await User.findById(socket.userId).select({name: 1}) //socket.userId is  mongo _id
    if(!user){
        socket.emit('room-error', {message: `Something went wrong`})
        return
    }

    //Autoleave other rooms before joining new room
    // Only broadcast if old room still exists in memory
    // — if this socket was the last user, removeUserBySocketId already deleted the room
    // and there's no one left to notify anyway 
    let oldRoomCode = removeUserBySocketId(socket.id)                               
    if(oldRoomCode && getRoomState(oldRoomCode)){
    socket.broadcast.to(oldRoomCode).emit('user-left', {message: `${user.name}-left`})
}

    addUserToRoom(roomCode, { socketId: socket.id, userId: socket.userId, username: user.name })
    socket.join(roomCode) 

    //sync-state
    socket.emit("sync-state", getRoomState(roomCode))


    socket.broadcast.to(roomCode).emit('user-joined', {message: `${user.name}-joined`})
}

const leaveRoom = (socket) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode) return
    const state = getRoomState(roomCode)
    const user = state.users.find(u => u.socketId === socket.id)
    if(!user) return
    const username = user.username
    removeUserBySocketId(socket.id)
    socket.leave(roomCode)
    socket.broadcast.to(roomCode).emit('user-left', {message: `${username}-left`})
}

module.exports = (io, socket) => {
    socket.on("join-room", async ({roomCode}) => { try{
        await  joinRoom(socket, roomCode)
    }catch(err){
        socket.emit('room-error', { message: 'Something went wrong' })
    }})
    socket.on("leave-room", () => {
        leaveRoom(socket)
    })
    socket.on("disconnect", () => {  //when user is offline auto trigger
        leaveRoom(socket)
    })
}