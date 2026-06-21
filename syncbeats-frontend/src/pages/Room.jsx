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
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 px-4 py-10">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Room</h1>
          <p className="text-gray-400 text-sm">
            Code: <span className="text-purple-300 font-mono">{code}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white text-sm font-medium">{users.length} watching</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
            <Player videoId='dQw4w9WgXcQ' socket={socket} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl flex flex-col h-[420px]">
            <h2 className="text-xl font-semibold text-white mb-4">Chat</h2>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No messages yet. Say hi.
                </div>
              ) : (
                messages.map((m, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-purple-300 font-semibold">{m.username}:</span>{' '}
                    <span className="text-gray-200">{m.message}</span>
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
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-gray-500
                  rounded-full
                  px-4
                  py-3
                  outline-none
                  transition-all
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/30
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
                  from-purple-600
                  to-indigo-600
                  hover:from-purple-500
                  hover:to-indigo-500
                  text-white
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

        {/* Right column: Users + Queue */}
        <div className="flex flex-col gap-6">

          {/* Users */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">In the room</h2>
            <UsersList users={users} />
          </div>

          {/* Queue */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Queue</h2>

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
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-gray-500
                  rounded-full
                  px-4
                  py-3
                  outline-none
                  transition-all
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/30
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
                  from-purple-600
                  to-indigo-600
                  hover:from-purple-500
                  hover:to-indigo-500
                  text-white
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {queueError && (
              <p className="text-red-400 text-sm mb-3">{queueError}</p>
            )}

            <div className="flex flex-col gap-2">
              {queue.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
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
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      hover:bg-white/[0.07]
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
                    <span className="flex-1 text-white text-sm truncate">
                      {item.title}
                    </span>
                    <button
                      onClick={() => removeFromQueue({ videoId: item.videoId })}
                      className="
                        w-7 h-7
                        flex
                        items-center
                        justify-center
                        rounded-full
                        text-gray-400
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