<div align="center">

```
███████╗██╗   ██╗███╗   ██╗ ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
███████╗ ╚████╔╝ ██╔██╗ ██║██║     ██████╔╝█████╗  ███████║   ██║   ███████╗
╚════██║  ╚██╔╝  ██║╚██╗██║██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ╚════██║
███████║   ██║   ██║ ╚████║╚██████╗██████╔╝███████╗██║  ██║   ██║   ███████║
╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

### *Watch together. Stay in sync.*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## What is SyncBeats?

**SyncBeats** is a real-time collaborative YouTube watch party app — built so you and your friends can watch the same video, at the exact same moment, no matter where you are.

Every play, pause, and queue change is instantly broadcast to everyone in the room. No more "okay, 3... 2... 1... play." No more "wait I'm 10 seconds ahead." Just watch.

> Built as a portfolio project to explore real-time architecture with Socket.io — but designed to feel like a real product.

---

## Features

### 🎬 Synchronized Playback
Play and pause are broadcast to all room members in real-time via Socket.io. When one person hits play, everyone's video starts. No polling. No lag. Bidirectional sync with echo suppression so your own player doesn't stutter.

### 📋 Collaborative Queue
Paste a YouTube link, it gets added to the shared queue instantly — title and thumbnail fetched automatically via oEmbed. Anyone in the room can add or remove videos. Click any item in the queue to jump to it. The queue updates live for everyone.

### 💬 Live Chat
Ephemeral room chat that lives and dies with the session. No messages stored. Type, send, react — just like a group watch party should feel.

### 🚪 Room System
Create a room and get a unique shareable code (e.g. `MOOD-PtZOWnD3`). Share the code, friends join, party starts. Full room state (users, queue, playback position) is synced on join — late arrivals catch up automatically.

### 👥 Live Presence
See who's in the room in real-time. The user list updates the moment someone joins or leaves — no refresh required.

### 🔐 Auth
JWT-based authentication with bcrypt password hashing. Protected routes on both REST API and Socket.io connection layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS v4 |
| **Player** | YouTube IFrame API |
| **Realtime** | Socket.io (WebSockets) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **State** | In-memory (Redis-ready architecture) |

---

## Architecture Highlights

### Real-time State Model
Room state (users, playback, queue) lives in-memory on the server — fast reads, zero DB overhead for live operations. The architecture is explicitly designed for a Redis migration when horizontal scaling becomes necessary: state helpers are a clean data layer with no socket coupling.

### Echo Suppression
The YouTube IFrame API fires `stateChange` events for both user actions *and* programmatic calls. Without handling this, syncing playback creates infinite echo loops. SyncBeats uses a time-based cooldown on the emitting client to suppress its own echoed events — more robust than single-shot booleans which race against buffering blips.

### Stale-Closure-Safe Socket Handling
React effects close over values at creation time. Socket references stored in `useRef` (not `useState`) ensure event handlers always see the live socket instance — a subtle but critical correctness fix for long-lived socket connections inside React components.

### Payload Shape Contract
`sync-state` (sent to the joiner) emits flat state directly. `user-joined`/`user-left` (broadcast to the room) wraps state under a `state` key alongside a `message`. This is explicitly documented and tested — the kind of inconsistency that causes silent bugs in collaborative apps.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/shashankk-singh/syncBeats.git
cd syncBeats

# Install backend dependencies
cd syncbeats-backend
npm install

# Install frontend dependencies
cd ../syncbeats-frontend
npm install
```

### Environment Setup

Create `syncbeats-backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/syncbeats
JWT_SECRET=your_secret_here
```
Create `syncbeats-frontend/.env`:


```env
# Replace localhost with your machine's local IP (e.g. http://192.168.1.x:5000) to run on your local Network
VITE_BACKEND_URL=http://localhost:5000 
```

### Run

```bash
# Terminal 1 — Backend
cd syncbeats-backend
npm run dev

# Terminal 2 — Frontend
cd syncbeats-frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), create a room, share the code, and watch together.

---

## Project Status

| Phase | Status |
|---|---|
| Phase 1 — Auth + REST API | ✅ Complete |
| Phase 2 — Socket.io real-time backend | ✅ Complete |
| Phase 3 — React frontend + YouTube player | ✅ Complete (v1) |
| Phase 4 — Monetization + Google OAuth | 🔲 Planned |

---

## What's Next

- Google OAuth (Sign in with Google)
- In-app YouTube search (no link-paste required)
- Drag-to-reorder queue
- Redis pub/sub for horizontal scaling
- Persistent chat history

---

## About

Built by **Shashank Singh**.

SyncBeats started as an experiment in real-time architecture and became a full-stack product. The backend is where the interesting problems live: stateful WebSocket connections, in-memory room lifecycle management, echo suppression, and a clean event contract between client and server.

> [GitHub](https://github.com/shashankk-singh/syncBeats)

---

<div align="center">
<sub>Made with Node.js, Socket.io, and a healthy obsession with eliminating lag.</sub>
</div>
