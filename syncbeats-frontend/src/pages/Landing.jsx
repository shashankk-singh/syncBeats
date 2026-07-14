import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'



function Logo({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" className={className}>
      <circle cx="60" cy="60" r="38" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="42" y="38" width="5" height="44" rx="2.5" fill="#f59e0b" opacity="0.5" />
      <rect x="51" y="28" width="5" height="64" rx="2.5" fill="#f59e0b" opacity="0.75" />
      <rect x="60" y="46" width="5" height="28" rx="2.5" fill="#f59e0b" />
      <rect x="69" y="34" width="5" height="52" rx="2.5" fill="#f59e0b" opacity="0.75" />
      <rect x="78" y="42" width="5" height="36" rx="2.5" fill="#f59e0b" opacity="0.5" />
      <text x="115" y="75" fontFamily="system-ui, sans-serif" fontSize="36" fontWeight="500" fill="#f5f0e8">SyncBeats</text>
    </svg>
  )
}

function SyncScrubber() {
  const [elapsed, setElapsed] = useState(102) // 01:42
  const total = 258 // 04:18

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => (prev >= total ? 0 : prev + 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-stone-800 bg-stone-900/70 p-7 pb-6 text-left shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-stone-500">
          <b className="text-stone-100 font-semibold">Late Night Mix</b> · playing now
        </span>
        <span className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-md tracking-wide">
          GROOVE-dN7OBJx9
        </span>
      </div>

      <div className="relative pt-8 pb-2">
        <div className="relative h-1.5 bg-stone-800 rounded-full">
          <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />

          <div className="absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-1/2 text-amber-400">
            <span className="absolute -top-[30px] left-1/2 -translate-x-1/2 text-[11px] text-stone-500 whitespace-nowrap">
              <b className="text-stone-300">you</b>
            </span>
            <span className="block w-[15px] h-[15px] rounded-full border-[3px] border-stone-900 shadow-[0_0_0_2px_currentColor] animate-pulse" />
          </div>

          <div className="absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-1/2 text-orange-300">
            <span className="absolute top-[20px] left-1/2 -translate-x-1/2 text-[11px] text-stone-500 whitespace-nowrap">
              <b className="text-stone-300">your friend</b>
            </span>
            <span className="block w-[15px] h-[15px] rounded-full border-[3px] border-stone-900 shadow-[0_0_0_2px_currentColor] animate-pulse [animation-delay:200ms]" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 font-mono text-xs text-stone-500">
        <span className="text-stone-300">{fmt(elapsed)} / {fmt(total)}</span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          synced
        </span>
      </div>
    </div>
  )
}

const steps = [
  {
    num: '01',
    label: 'host',
    title: 'Create a room',
    body: 'Name it, and SyncBeats spins up a shared player, queue, and chat instantly — no setup.',
  },
  {
    num: '02',
    label: 'invite',
    title: 'Share the code',
    body: 'Send a short room code to anyone you want in. They join in one tap, no account juggling.',
  },
  {
    num: '03',
    label: 'watch',
    title: 'Queue and watch together',
    body: "Anyone can add a video, hit play, or scrub — everyone's player follows in real time.",
    chip: 'GROOVE-dN7OBJx9',
  },
]

const features = [
  {
    title: 'Live chat',
    body: "Ephemeral, in-room chat that disappears when the party's over — no history to scroll through later.",
    icon: <path d="M5 5h14v10H8l-3 3V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  },
  {
    title: 'Shared queue',
    body: 'Anyone in the room can line up the next video. First come, first played.',
    icon: <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  },
  {
    title: 'Instant sync',
    body: 'Play, pause, and seek travel to every viewer in real time — no host required to control it.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Simple room codes',
    body: 'Memorable codes like GROOVE-dN7OBJx9 — easy to share, easy to type back in.',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const { userId, isLoading, authError } = useAuth()
  const isAuthenticated = !isLoading && !!userId

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleCreateRoom = () => {
    navigate(isAuthenticated ? '/dashboard' : '/signup')
  }

  return (
    <div className="min-h-screen bg-[#15120d] relative overflow-hidden text-stone-100">
      {/* grain texture */}
      <div
        className="fixed inset-0 z-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 250 250%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27250%27 height=%27250%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')",
        }}
      />
      {/* warm glow */}
      <div className="absolute z-0 top-20 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#15120d]/85 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-3">
          <Logo className="h-10 w-auto -ml-4" />
          <nav className="flex items-center gap-8 text-sm text-stone-400">
            <a href="#how" className="hover:text-stone-100 transition-colors">How it works</a>
            <a href="#features" className="hidden sm:inline hover:text-stone-100 transition-colors">Features</a>
            <a
              href="https://github.com/shashankk-singh/syncBeats"
              className="hidden sm:inline hover:text-stone-100 transition-colors"
            >
              GitHub
            </a>
            <button
              onClick={handleCreateRoom}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm px-4 py-2 rounded-lg hover:scale-[1.02] transition-transform"
            >
              Create a room
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-6 pt-24 pb-20 text-center max-w-5xl mx-auto z-10">
        <span className="inline-flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3.5 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          2 people watching in GROOVE-dN7OBJx9 right now
        </span>

        <h1 className="font-semibold tracking-tight leading-[1.08] text-4xl sm:text-5xl md:text-6xl max-w-3xl mx-auto mb-5">
          Press play once.<br />
          Everyone hears it{' '}
          <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
            live
          </span>.
        </h1>

        <p className="text-stone-300 text-base sm:text-lg max-w-lg mx-auto mb-10">
          SyncBeats keeps a YouTube video, a queue, and a chat perfectly in step across everyone in the room —
          no more "wait, pause it" texts.
        </p>

        <div className="flex items-center justify-center gap-3.5 flex-wrap mb-16">
          <button
            onClick={handleCreateRoom}
            className="font-bold text-sm px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 hover:scale-[1.02] transition-transform"
          >
            Create a room
          </button>
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-sm px-6 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            Join with a code
          </button>
        </div>

        <SyncScrubber />
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative px-6 py-20 border-t border-stone-800 max-w-6xl mx-auto z-10">
        <div className="max-w-xl mb-14">
          <span className="block text-sm font-semibold tracking-wide text-amber-500 mb-3">HOW IT WORKS</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
            Three steps between "let's watch this" and actually watching it.
          </h2>
        </div>

        <div className="relative grid gap-7 md:grid-cols-3">
          <div className="hidden md:block absolute top-[38px] left-[8%] right-[8%] h-px bg-[repeating-linear-gradient(90deg,#292524_0_8px,transparent_8px_16px)] -z-0" />
          {steps.map((s) => (
            <div key={s.num} className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-xl shadow-black/20">
              <span className="block text-sm text-stone-500 mb-4">
                <b className="text-amber-500">{s.num}</b> · {s.label}
              </span>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-stone-400 text-sm">{s.body}</p>
              {s.chip && (
                <span className="inline-block mt-3.5 font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-md">
                  {s.chip}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative px-6 py-20 border-t border-stone-800 max-w-6xl mx-auto z-10">
        <div className="max-w-xl mb-14">
          <span className="block text-sm font-semibold tracking-wide text-amber-500 mb-3">WHAT'S INSIDE</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
            Everything a watch party needs, nothing it doesn't.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-stone-800 border border-stone-800 rounded-2xl overflow-hidden">
          {features.map((f) => (
            <div key={f.title} className="bg-stone-950 p-7">
              <span className="w-9 h-9 rounded-[10px] bg-amber-500/10 text-amber-400 grid place-items-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">{f.icon}</svg>
              </span>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-stone-500 text-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24 border-t border-stone-800 text-center max-w-6xl mx-auto z-10">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-xl mx-auto mb-4">
          Your next watch party is one code away.
        </h2>
        <p className="text-stone-500 mb-8">Free, no download, works in any browser.</p>
        <div className="flex items-center justify-center gap-3.5 flex-wrap">
          <button
            onClick={handleCreateRoom}
            className="font-bold text-sm px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 hover:scale-[1.02] transition-transform"
          >
            Create a room
          </button>
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-sm px-6 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            Join with a code
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-stone-800 px-6 py-8 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4 text-sm text-stone-500">
          <span>Built by Shashank Singh · MIT Licensed</span>
          <div className="flex gap-5">
            <a href="https://github.com/shashankk-singh/syncBeats" className="hover:text-stone-100 transition-colors">GitHub</a>
            <a href="#how" className="hover:text-stone-100 transition-colors">How it works</a>
            <a href="#features" className="hover:text-stone-100 transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  )
}