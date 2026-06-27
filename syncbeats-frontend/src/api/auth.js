import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})

export function loginUser(email, password) {
  return API.post('/auth/login', { email, password })
}

export function signupUser(username, email, password) {
  return API.post('/auth/signup', { name: username, email, password })
}

export function getMe(token) {
  return API.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
}