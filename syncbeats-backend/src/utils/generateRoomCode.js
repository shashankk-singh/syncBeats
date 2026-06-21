const words = ["VIBE","DROP","BEAT","BASS","HYPE","GLOW","ECHO","NEON","RIFF","FLOW",
    "MOOD","ZONE","WAVE","BOOM","JAMM","SLAY","CHILL","SPARK","GROOVE","PULSE"]

function generateRoomCode(length = 8) {
  const word = words[Math.floor(Math.random() * words.length)]
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  const result = word+ "-" + code
  return result;
}

module.exports = generateRoomCode