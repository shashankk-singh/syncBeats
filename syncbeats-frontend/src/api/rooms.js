import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
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