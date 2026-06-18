const {getRoomState, updateQueue, updatePlayback, getRoomCodeBySocketId} = require('../state');

const updateTimeStamp = (socket,eventName,patch) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    } 
    updatePlayback(roomCode, patch)
    const state = getRoomState(roomCode)
    socket.to(roomCode).emit(`${eventName}`, state.playback)

}

const changeVideo = (socket, {videoId}) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    }
    const patch = {videoId, timestamp: 0, isPlaying: false}
    updatePlayback(roomCode, patch)
    const state = getRoomState(roomCode)
    socket.to(roomCode).emit('video-changed', state.playback)
}

const addQueue = (socket, { videoId, title }) =>{
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    }
    const state = getRoomState(roomCode)
    const newQueue = [...state.queue, { videoId, title }]
    updateQueue(roomCode, newQueue)
    socket.to(roomCode).emit('queue-added', newQueue)
}

const removeQueue = (socket, {videoId}) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    }
    const currentQueue = getRoomState(roomCode).queue
    const newQueue = currentQueue.filter(item => item.videoId !== videoId)
    updateQueue(roomCode, newQueue)
    socket.to(roomCode).emit('queue-remove', newQueue)
}

module.exports = (io,socket) => {
    socket.on('play', (patch) =>{
        updateTimeStamp(socket,'play',patch)
    })
    socket.on('pause', (patch) =>{
        updateTimeStamp(socket,'pause',patch)
    })
    socket.on('seek', (patch) =>{
        updateTimeStamp(socket,'seek',patch)
    })

    socket.on('video-change' , ({videoId})=>{
        changeVideo(socket, { videoId })
    })

    socket.on('queue-add', ({ videoId, title })=>{
        addQueue(socket,{ videoId, title } )
    })
    socket.on('queue-remove', ({ videoId }) => {
    removeQueue(socket, { videoId })
})
}