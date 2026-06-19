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
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 px-4 py-10">
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create Room
          </h2>

          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              text-white
              placeholder-gray-500
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-500/30
              mb-4
            "
          />

          <button
            onClick={handleCreateRoom}
            className="
              w-full
              bg-gradient-to-r
              from-purple-600
              to-indigo-600
              hover:from-purple-500
              hover:to-indigo-500
              text-white
              font-semibold
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
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Join Room
          </h2>

          <input
            type="text"
            placeholder="Enter room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              text-white
              placeholder-gray-500
              rounded-xl
              px-4
              py-3
              outline-none
              transition-all
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-500/30
              mb-4
            "
          />

          <button
            onClick={handleJoinRoom}
            className="
              w-full
              border
              border-purple-500/40
              bg-purple-500/10
              hover:bg-purple-500/20
              text-purple-300
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

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">
          My Rooms
        </h2>

        {rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
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
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  hover:bg-white/[0.07]
                  transition-all
                  p-5
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {room.name}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    Code: {room.code}
                  </p>
                </div>

                <div className="text-white font-medium">
                  Join →
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