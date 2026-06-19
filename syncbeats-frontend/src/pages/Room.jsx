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
  const [error, setError] = useState('')
  const { code } = useParams()
  const { token } = useAuth()
  const socket = useSocket(token)
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
  </div>
)
}

export default Room