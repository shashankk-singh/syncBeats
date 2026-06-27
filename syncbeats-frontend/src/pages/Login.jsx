import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    try {
      const response = await loginUser(email, password)
      const token = response.data.token
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch(err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
  <div className="min-h-screen bg-[#15120d] relative flex items-center justify-center px-4 overflow-hidden">
    {/* grain texture */}
    <div
      className="fixed inset-0 z-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
      style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 250 250%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27250%27 height=%27250%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')",
      }}
    />

    {/* subtle warm glow behind the card */}
    <div className="absolute z-0 top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="relative z-10 w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900/70 p-8 shadow-2xl shadow-black/40">
      <svg xmlns="http://www.w3.org/2000/svg" width="330" height="62" viewBox="0 0 400 120" className="mb-6 -ml-19">
        <circle cx="60" cy="60" r="38" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4"/>
        <rect x="42" y="38" width="5" height="44" rx="2.5" fill="#f59e0b" opacity="0.5"/>
        <rect x="51" y="28" width="5" height="64" rx="2.5" fill="#f59e0b" opacity="0.75"/>
        <rect x="60" y="46" width="5" height="28" rx="2.5" fill="#f59e0b"/>
        <rect x="69" y="34" width="5" height="52" rx="2.5" fill="#f59e0b" opacity="0.75"/>
        <rect x="78" y="42" width="5" height="36" rx="2.5" fill="#f59e0b" opacity="0.5"/>
        <text x="115" y="75" fontFamily="system-ui, sans-serif" fontSize="36" fontWeight="500" fill="#f5f0e8">SyncBeats</text>
      </svg>
      <h1 className="text-stone-100 text-3xl font-bold mb-1">Welcome back</h1>
      <p className="text-stone-500 text-sm mb-8">Log in to keep the party going.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="
          w-full
          bg-stone-950/60
          border
          border-stone-800
          text-stone-100
          placeholder-stone-600
          rounded-xl
          px-4
          py-3
          mb-4
          outline-none
          transition-all
          focus:border-amber-500/60
          focus:ring-2
          focus:ring-amber-500/20
        "
      />

      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full
            bg-stone-950/60
            border
            border-stone-800
            text-stone-100
            placeholder-stone-600
            rounded-xl
            px-4
            py-3
            pr-12
            outline-none
            transition-all
            focus:border-amber-500/60
            focus:ring-2
            focus:ring-amber-500/20
          "
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-200 transition-colors"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="
          w-full
          bg-gradient-to-r
          from-amber-500
          to-yellow-500
          hover:from-amber-400
          hover:to-yellow-400
          text-stone-950
          font-bold
          py-3
          rounded-xl
          transition-all
          duration-300
          hover:scale-[1.02]
        "
      >
        Log in
      </button>

      <p className="text-stone-500 text-center text-sm mt-6">
        Don't have an account?{' '}
        <span
          onClick={() => navigate('/signup')}
          className="text-amber-400 cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  </div>
)
}

export default Login