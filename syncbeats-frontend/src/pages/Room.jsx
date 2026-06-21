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
    <div>
      Room {code}
      <div className="p-4">
        <Player videoId="dQw4w9WgXcQ" socket={socket} />
      </div>      
      <UsersList users={users} />
      <div>
        {messages.map((m, index) => (
          <div key={index}>
            <strong>{m.username}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3 bg-gray-800">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500/40"
        />
        <button
          onClick={sendMessage}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all shrink-0"
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

      {/* Queue */}
      <div className="bg-gray-800 rounded-lg p-4 mt-4">
        <h2 className="text-white font-semibold mb-3">Queue</h2>

        <div className="flex items-center gap-2 mb-2">
          <input
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addQueue()
            }}
            placeholder="Paste a YouTube link..."
            className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500/40"
          />
          <button
            onClick={addQueue}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all shrink-0"
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
          {queue.length === 0 && (
            <p className="text-gray-400 text-sm">
              Queue is empty — paste a link above to add one.
            </p>
          )}
          {queue.map((item) => (
            <div
              key={item.videoId}
              className="flex items-center gap-3 bg-gray-700/60 rounded-lg p-2"
            >
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-9 object-cover rounded shrink-0"
                />
              ) : (
                <div className="w-16 h-9 bg-black rounded shrink-0" />
              )}
              <span className="flex-1 text-white text-sm truncate">
                {item.title}
              </span>
              <button
                onClick={() => removeFromQueue({ videoId: item.videoId })}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-red-600/80 transition-all shrink-0"
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
          ))}
        </div>
      </div>
    </div>
  )
}
export default Room