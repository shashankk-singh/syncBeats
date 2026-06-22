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

const changeVideo = (io,socket, {videoId}) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    }
    const currentQueue = getRoomState(roomCode).queue
    const clickedItem = currentQueue.find(item => item.videoId == videoId)
    const reorderedQueue = [clickedItem, ...currentQueue.filter(item => item.videoId !== videoId)]
    updateQueue(roomCode, reorderedQueue)

    const patch = {videoId, timestamp: 0, isPlaying: false}
    updatePlayback(roomCode, patch)
    const state = getRoomState(roomCode)
    io.to(roomCode).emit('video-changed', state.playback)
    io.to(roomCode).emit('queue-updated', state.queue)
}

const addQueue = (io,socket, { videoId, title, thumbnail}) =>{
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    }
    const state = getRoomState(roomCode)
    const newQueue = [...state.queue, { videoId, title, thumbnail }]
    updateQueue(roomCode, newQueue)
    io.to(roomCode).emit('queue-added', newQueue)
}

const removeQueue = (io,socket, {videoId}) => {
    const roomCode = getRoomCodeBySocketId(socket.id)
    if(!roomCode){
        return socket.emit('room-error', { message: 'Join a room first' })
    }
    const currentQueue = getRoomState(roomCode).queue
    const newQueue = currentQueue.filter(item => item.videoId !== videoId)
    updateQueue(roomCode, newQueue)
    io.to(roomCode).emit('queue-removed', newQueue)
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
        changeVideo(io,socket, { videoId })
    })

    socket.on('queue-add', ({ videoId, title, thumbnail })=>{
        addQueue(io,socket,{ videoId, title, thumbnail } )
    })
    socket.on('queue-remove', ({ videoId }) => {
    removeQueue(io,socket, { videoId })
})
}