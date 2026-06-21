import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyRooms, createRoom } from '../api/rooms'


function Dashboard() {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {         //useEffect can't be async directly thereffore need a async function inside it
    async function fetchRooms() {
      try{
        const response = await getMyRooms(token)
        setRooms(response.data.rooms)
      }catch(err){
        setError(err.response?.data?.message || 'Something went wrong')
      }
    }
    fetchRooms()
  }, [])

  async function handleCreateRoom() {
    try{const response = await createRoom(token, roomName)
    const roomCode = response.data.details.code
    navigate(`/room/${roomCode}`)
    }catch(err){
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  async function handleJoinRoom() {
    await navigate(`/room/${joinCode}`)
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
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-stone-100 mb-2">
          Dashboard
        </h1>
        <p className="text-stone-500">
          Manage your rooms and keep the party going.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Create Room */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-stone-100 mb-4">
            Create Room
          </h2>

          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="
              w-full
              bg-stone-950/60
              border
              border-stone-800
              text-stone-100
              placeholder-stone-600
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              focus:border-amber-500/60
              focus:ring-2
              focus:ring-amber-500/20
              mb-4
            "
          />

          <button
            onClick={handleCreateRoom}
            className="
              w-full
              bg-gradient-to-r
              from-amber-500
              to-yellow-500
              hover:from-amber-400
              hover:to-yellow-400
              text-stone-950
              font-bold
              py-3
              rounded-xl
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >
            Create Room
          </button>
        </div>

        {/* Join Room */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-stone-100 mb-4">
            Join Room
          </h2>

          <input
            type="text"
            placeholder="Enter room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="
              w-full
              bg-stone-950/60
              border
              border-stone-800
              text-stone-100
              placeholder-stone-600
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              focus:border-amber-500/60
              focus:ring-2
              focus:ring-amber-500/20
              mb-4
            "
          />

          <button
            onClick={handleJoinRoom}
            className="
              w-full
              border
              border-amber-500/30
              bg-amber-500/10
              hover:bg-amber-500/20
              text-amber-300
              font-semibold
              py-3
              rounded-xl
              transition-all
            "
          >
            Join Room
          </button>
        </div>
      </div>

      {/* My Rooms */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-stone-100 mb-6">
          My Rooms
        </h2>

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
                className="
                  cursor-pointer
                  rounded-xl
                  border
                  border-stone-800
                  bg-stone-950/40
                  hover:bg-stone-800/60
                  transition-all
                  p-5
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h3 className="text-stone-100 font-semibold text-lg">
                    {room.name}
                  </h3>

                  <p className="text-stone-500 text-sm mt-1">
                    Code: {room.code}
                  </p>
                </div>

                <div className="text-amber-400 font-medium">
                  Open →
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