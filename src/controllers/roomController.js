const Room = require('../models/room')
const generateRoomCode = require('../utils/generateRoomCode')

const createRoom = async (req, res) => {
    const {name} = req.body
        if (!name) {
            return res.status(400).json({ message: "Room name is required" })
        }
    let code;
    do{
        code = generateRoomCode()
    }while((await Room.findOne({code})) !== null) //guaranteed-unique code

    try{
        const host = req.userId
        const newRoom = new Room({name, code, host})
        await newRoom.save()
        res.status(201).json({message: `${name} successfully created`, 
            details: { id: newRoom._id, name: newRoom.name, code: newRoom.code } })
    }catch(err){
        res.status(500).json({message: 'something went wrong'})
    }
}

module.exports = createRoom;