import { useEffect, useState } from 'react'
import { getMe } from '../api/auth'

function useAuth() {
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getMe()
        setUserId(response.data.details._id)
      } catch (err) {
        setError('User not logged in')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { userId, isLoading, authError }
}

export default useAuth