const { verify } = require('jsonwebtoken');;
const roomHandlers = require('../sockets/handlers/roomHandlers')

module.exports = (io) =>{
    io.use((socket, next) => {                 //.use() use for middleware
        const token = socket.handshake.auth.token || socket.handshake.headers.token
        // did this because postman did not have the auth section so i have to create a custom header therfore req was header.token instead of auth.token
        if(!token){
            return next(new Error("Unauthorized"))
        }
        try{
            const decoded = verify(token, process.env.JWT_SECRET)
            socket.userId = decoded.userId
            next()
        }catch(err){
            return next(new Error("Unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        console.log("yeahh we are connected through sockets now!!!")
        roomHandlers(io, socket) 
    })

}   

