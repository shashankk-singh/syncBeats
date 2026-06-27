import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function useSocket(token) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
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