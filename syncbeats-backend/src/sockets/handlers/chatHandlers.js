
const {getRoomCodeBySocketId, getRoomState} = require('../state');

const sendMessage = (io,socket, message) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    const state = getRoomState(roomCode)
    if(!state){
        return socket.emit('room-error', { message: 'join room to send message' })
    }

    if(message == undefined){
        return socket.emit('room-error', { message: 'can not send empty message' })
    }

    const username = state.users.find(u => u.socketId === socket.id).username
    io.to(roomCode).emit('new-message', { username, message })


}

module.exports = (io,socket) => {
    socket.on("chat-message", ({ content }) => {
        sendMessage(io,socket,content)
    })
}