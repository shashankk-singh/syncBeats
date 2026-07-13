import axios from 'axios'

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(error)
      }

      try {
        await API.post('/auth/refresh')
        return API(originalRequest) 
      } catch (refreshError) {
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API