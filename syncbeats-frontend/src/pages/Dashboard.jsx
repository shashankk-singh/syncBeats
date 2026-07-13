import { useState, useEffect } from 'react'
import { resolvePath, useNavigate } from 'react-router-dom'
import { getMyRooms, createRoom, deleteRoom } from '../api/rooms'
import { logoutUser } from '../api/auth'


function Dashboard() {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
 

  useEffect(() => {         //useEffect can't be async directly thereffore need a async function inside it
    async function fetchRooms() {
      try{
        const response = await getMyRooms()
        setRooms(response.data.rooms)
      }catch(err){
        setError(err.response?.data?.message || 'Something went wrong')
      }
    }
    fetchRooms()
  }, [])

  async function handleCreateRoom() {
    try{const response = await createRoom(roomName)
    const roomCode = response.data.details.code
    navigate(`/room/${roomCode}`)
    }catch(err){
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  async function handleJoinRoom() {
    await navigate(`/room/${joinCode}`)
  }

  async function handleDeleteRoom(code) {
    try{
      const response = await deleteRoom(code)
      setRooms(prev => prev.filter(r => r.code !== code))
    }catch(err){
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  async function handleLogout() {
    try{
      const response = await logoutUser()
      navigate('/')
      
    }catch(err){setError(err.response?.data?.message || 'Something went wrong')}
  }


return (
  <div className="min-h-screen bg-[#15120d] relative px-4 py-10 overflow-hidden">
    {/* grain texture */}
    <div
      className="fixed inset-0 z-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
      style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 250 250%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27250%27 height=%27250%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')",
      }}
    />

    {/* warm glow */}
    <div className="absolute z-0 top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

    <div className="relative z-10 max-w-6xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="340" height="72" viewBox="0 0 400 120" className="mb-2 -ml-17">
            <circle cx="60" cy="60" r="38" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4"/>
            <rect x="42" y="38" width="5" height="44" rx="2.5" fill="#f59e0b" opacity="0.5"/>
            <rect x="51" y="28" width="5" height="64" rx="2.5" fill="#f59e0b" opacity="0.75"/>
            <rect x="60" y="46" width="5" height="28" rx="2.5" fill="#f59e0b"/>
            <rect x="69" y="34" width="5" height="52" rx="2.5" fill="#f59e0b" opacity="0.75"/>
            <rect x="78" y="42" width="5" height="36" rx="2.5" fill="#f59e0b" opacity="0.5"/>
            <text x="115" y="75" fontFamily="system-ui, sans-serif" fontSize="36" fontWeight="500" fill="#f5f0e8">SyncBeats</text>
          </svg>
          <p className="text-stone-300 text-sm font-medium tracking-wide">Manage your rooms and keep the party going.</p>
        </div>

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            rounded-full
            border border-stone-800
            bg-stone-900/70
            px-4 py-2
            text-sm text-stone-400
            hover:text-stone-100
            hover:border-stone-700
            transition-all
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log out
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Create Room */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-stone-100 mb-4">Create Room</h2>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full bg-stone-950/60 border border-stone-800 text-stone-100 placeholder-stone-600 rounded-xl px-4 py-3 outline-none transition-all focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 mb-4"
          />
          <button
            onClick={handleCreateRoom}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
          >
            Create Room
          </button>
        </div>

        {/* Join Room */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-stone-100 mb-4">Join Room</h2>
          <input
            type="text"
            placeholder="Enter room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full bg-stone-950/60 border border-stone-800 text-stone-100 placeholder-stone-600 rounded-xl px-4 py-3 outline-none transition-all focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 mb-4"
          />
          <button
            onClick={handleJoinRoom}
            className="w-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold py-3 rounded-xl transition-all"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* My Rooms */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-stone-100 mb-6">My Rooms</h2>

        {rooms.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            No rooms found. Create your first room to get started.
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div
                key={room._id}
                onClick={() => navigate(`/room/${room.code}`)}
                className="cursor-pointer rounded-xl border border-stone-800 bg-stone-950/40 hover:bg-stone-800/60 transition-all p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-stone-100 font-semibold text-lg">{room.name}</h3>
                  <p className="text-stone-500 text-sm mt-1">Code: {room.code}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-medium">Open →</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRoom(room.code)
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-stone-500 hover:text-white hover:bg-red-500/80 transition-all shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)
}
export default Dashboard