import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function useSocket(token) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return
    const socketInstance = io('http://localhost:5000', {
    auth: { token }
  })
  setSocket(socketInstance)
  
  return () => {
    socketInstance.disconnect()
  }
  }, [token])

  return socket
}

export default useSocket