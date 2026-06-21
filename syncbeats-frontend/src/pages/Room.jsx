import { data, useParams } from 'react-router-dom'
import { use, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useSocket from '../hooks/useSocket'
import UsersList from '../components/UsersList'
import { extractVideoId } from '../../utils/extractVideoId';
import { fetchVideoMetadata } from '../../utils/fetchVideoMetadata';
import Player from '../components/Player';

function Room() {
  const [users, setUsers] = useState([])
  const [playback, setPlayback] = useState({ videoId: null, timestamp: 0, isPlaying: false })
  const [videoLink, setVideoLink] = useState('')
  const [queue, setQueue] = useState([])
  const [queueError, setQueueError] = useState('')
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [error, setError] = useState('')
  const { code } = useParams()
  const { token } = useAuth()
  const socket = useSocket(token)

  function sendMessage() {
    if (!socket) return
    if (!chatInput.trim()){
      setError('can not send empty message')
      return
    }
    socket.emit('chat-message', { content: chatInput })
    setChatInput('')
  }

  async function addQueue(){
    if (!socket) return
    if (!videoLink.trim()){
      setQueueError("That doesn't look like a valid YouTube link")
      return
    }
    const videoId = extractVideoId(videoLink)
    if(!videoId){
      setQueueError("That doesn't look like a valid YouTube link")
      return
    }
    const metadata = await fetchVideoMetadata(videoId)
    const title = metadata?.title ?? "Unknown title"
    const thumbnail = metadata?.thumbnail ?? null
  
    socket.emit("queue-add", { videoId, title, thumbnail })
    setVideoLink('')
  }

  async function removeFromQueue({videoId}) {
    if (!socket) return
    socket.emit("queue-remove", {videoId})
    
  }

  useEffect(() => {
    if (!socket) return
    socket.emit('join-room', { roomCode: code })

    socket.on('sync-state', (data) => {
    setUsers(data.users)
    setPlayback(data.playback)
    setQueue(data.queue)
    })

    socket.on('user-joined', (data) => {
      setUsers(data.state.users)
    })

    socket.on('user-left', (data) => {
      setUsers(data.state.users)
    })

    socket.on('new-message', (data) => {
      setMessages(prev => [...prev, data]) //prev ensures  always calculate the new state from the most up-to-date snapshot
    })

    socket.on('room-error', (data) => {
      setError('Something went wrong')
    })

    socket.on('queue-added',(data) => {
      setQueue(data)
    } )

    socket.on('queue-removed', (data) => {
      setQueue(data)
    })

    return () => {
    socket.off('sync-state')
    socket.off('user-joined')
    socket.off('user-left')
    socket.off('new-message')
    socket.off('room-error')
    socket.off('queue-added')
    socket.off('queue-removed')
  }

  }, [socket])

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
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-stone-100 mb-1">
            Room
          </h1>
          <p className="text-stone-500 text-sm">
            Code:{' '}
            <span className="text-amber-400 font-mono">
              {code}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/70 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-stone-100 text-sm font-medium">
            {users.length} watching
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4 shadow-2xl shadow-black/30">
            <Player videoId="dQw4w9WgXcQ" socket={socket} />
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30 flex flex-col h-[420px]">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              Chat
            </h2>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-sm">
                  No messages yet. Say hi.
                </div>
              ) : (
                messages.map((m, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-amber-400 font-semibold">
                      {m.username}:
                    </span>{' '}
                    <span className="text-stone-200">
                      {m.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage()
                }}
                placeholder="Type a message..."
                className="
                  flex-1
                  bg-stone-950/60
                  border
                  border-stone-800
                  text-stone-100
                  placeholder-stone-600
                  rounded-full
                  px-4
                  py-3
                  outline-none
                  transition-all
                  focus:border-amber-500/60
                  focus:ring-2
                  focus:ring-amber-500/20
                "
              />

              <button
                onClick={sendMessage}
                className="
                  w-11 h-11
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-r
                  from-amber-500
                  to-yellow-500
                  hover:from-amber-400
                  hover:to-yellow-400
                  text-stone-950
                  transition-all
                  duration-300
                  hover:scale-[1.05]
                  shrink-0
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              In the room
            </h2>

            <UsersList users={users} />
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              Queue
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <input
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addQueue()
                }}
                placeholder="Paste a YouTube link..."
                className="
                  flex-1
                  bg-stone-950/60
                  border
                  border-stone-800
                  text-stone-100
                  placeholder-stone-600
                  rounded-full
                  px-4
                  py-3
                  outline-none
                  transition-all
                  focus:border-amber-500/60
                  focus:ring-2
                  focus:ring-amber-500/20
                "
              />

              <button
                onClick={addQueue}
                className="
                  w-11 h-11
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-r
                  from-amber-500
                  to-yellow-500
                  hover:from-amber-400
                  hover:to-yellow-400
                  text-stone-950
                  transition-all
                  duration-300
                  hover:scale-[1.05]
                  shrink-0
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {queueError && (
              <p className="text-red-400 text-sm mb-3">
                {queueError}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {queue.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-sm">
                  Queue is empty — paste a link above to add one.
                </div>
              ) : (
                queue.map((item) => (
                  <div
                    key={item.videoId}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-stone-800
                      bg-stone-950/40
                      hover:bg-stone-800/60
                      transition-all
                      p-2
                    "
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-9 object-cover rounded-lg shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-9 bg-black/40 rounded-lg shrink-0" />
                    )}

                    <span className="flex-1 text-stone-100 text-sm truncate">
                      {item.title}
                    </span>

                    <button
                      onClick={() =>
                        removeFromQueue({ videoId: item.videoId })
                      }
                      className="
                        w-7 h-7
                        flex
                        items-center
                        justify-center
                        rounded-full
                        text-stone-500
                        hover:text-white
                        hover:bg-red-500/80
                        transition-all
                        shrink-0
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
export default Room