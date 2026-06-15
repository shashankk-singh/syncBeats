const words = ["VIBE","DROP","BEAT","BASS","HYPE","GLOW","ECHO","NEON","RIFF","FLOW",
    "MOOD","ZONE","WAVE","BOOM","JAMM","SLAY","CHILL","SPARK","GROOVE","PULSE"]

const generateRoomCode = function(){
    const word = words[Math.floor(Math.random() * words.length)]
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, "0") // number-> make it to string -> padit with 0 to make it 4 digit {"7"->"007"}
    const roomCode = word +"-" +number
    return roomCode
}

module.exports = generateRoomCode