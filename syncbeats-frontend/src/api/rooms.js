import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true
})

export function getMyRooms() {
  return API.get('/rooms/my')
}

export function createRoom(name) {
  return API.post('/rooms', {name})
}

export function getRoomByCode(code) {
  return API.get(`/rooms/${code}`)
}

export function deleteRoom(code) {
  return API.delete(`/rooms/${code}`)
}