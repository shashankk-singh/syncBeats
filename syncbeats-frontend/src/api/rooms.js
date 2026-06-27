import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})

export function getMyRooms(token) {
  return API.get('/rooms/my', {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function createRoom(token, name) {
  return API.post('/rooms', {name}, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function getRoomByCode(token, code) {
  return API.get(`/rooms/${code}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export function deleteRoom(token, code) {
  return API.delete(`/rooms/${code}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}