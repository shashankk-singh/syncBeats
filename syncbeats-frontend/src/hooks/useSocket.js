import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function useSocket(isAuthenticated) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true
  })
  setSocket(socketInstance)
  
  return () => {
    socketInstance.disconnect()
  }
  }, [isAuthenticated])

  return socket
}

export default useSocket