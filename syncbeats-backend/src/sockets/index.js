const { parse } = require('cookie')
const { verify } = require('jsonwebtoken');
const roomHandlers = require('../sockets/handlers/roomHandlers');
const chatHandlers = require('../sockets/handlers/chatHandlers');
const playbackHandlers = require('./handlers/playbackHandlers');

module.exports = (io) =>{
    io.use((socket, next) => { 
        if (!socket.handshake.headers.cookie) {
            return next(new Error("Unauthorized"))
        }  

        const response = parse(socket.handshake.headers.cookie)
        const accessToken = response.accessToken
        try{
            const decoded = verify(accessToken, process.env.JWT_SECRET)
            if (decoded.type !== 'access') {
              return next(new Error("Unauthorized"))
            }
            socket.userId = decoded.userId
            next()
        }catch(err){
            return next(new Error("Unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        roomHandlers(io, socket)
        chatHandlers(io,socket)
        playbackHandlers(io, socket)

    })

}   

