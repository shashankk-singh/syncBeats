import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useSocket from '../hooks/useSocket'
import UsersList from '../components/UsersList'

function Room() {
  const [users, setUsers] = useState([])
  const [playback, setPlayback] = useState({ videoId: null, timestamp: 0, isPlaying: false })
  const [queue, setQueue] = useState([])
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

  useEffect(() => {
    if (!socket) return
    socket.emit('join-room', { roomCode: code })

    socket.on('sync-state', (data) => {
    console.log('sync-state received:', data)
    setUsers(data.users)
    setPlayback(data.playback)
    setQueue(data.queue)
    })

    socket.on('user-joined', (data) => {
      setUsers(data.state.users)
      console.log('User joined')
    })

    socket.on('user-left', (data) => {
      setUsers(data.state.users)
      console.log('User left')
      console.log('sync-state received:', data)
    })

    socket.on('new-message', (data) => {
      setMessages(prev => [...prev, data]) //prev ensures  always calculate the new state from the most up-to-date snapshot
    })

    socket.on('room-error', (data) => {
      setError('Something went wrong')
    })
    return () => {
    socket.off('sync-state')
    socket.off('user-joined')
    socket.off('user-left')
    socket.off('new-message')
    socket.off('room-error')
  }
    
  }, [socket])

return (
    <div>
      Room {code}
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
    </div>
  )
}

export default Room