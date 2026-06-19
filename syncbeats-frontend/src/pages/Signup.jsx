import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signupUser } from '../api/auth'


function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    try{
      const response = await signupUser(email, password, username)
      const token = response.data.token
      localStorage.setItem('token', token) //setitem('key' value)
      navigate('/dashboard')
    }catch(err){
      setError(err.response?.data?.message || 'Something went wrong')
    }

  }
    return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-3xl font-bold mb-6">Sign Up</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 outline-none"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none pr-12"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
        >
          Sign Up
        </button>

        <p className="text-gray-400 text-center mt-4">
          Already have an account? {' '}
          <span
            onClick={() => navigate('/login')}
            className="text-purple-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Signup