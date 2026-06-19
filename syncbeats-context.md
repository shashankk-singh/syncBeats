# SyncBeats — Project Context (Updated)

## Tech Stack
- Frontend: React + Tailwind CSS + YouTube IFrame API
- Backend: Node.js + Express + Socket.io
- Database: MongoDB (Mongoose) — local for now, Atlas later
- Auth: JWT tokens (jsonwebtoken)
- Password hashing: bcryptjs
- Redis: Skipped, using in-memory JS objects for now

## Project Structure (current state)
syncbeats-backend/

src/

config/

dataBase.js        ✅ DONE

models/

user.js             ✅ DONE — schema + pre-save hash hook + comparePasswords

Room.js             ✅ DONE — name, code, host (ref User)

Message.js          ✅ DONE — room (ref Room), sender (ref User), content (NOT used — chats are ephemeral)

controllers/

authController.js   ✅ DONE — signup, login, getMe

roomController.js   ✅ DONE — createRoom, getMyRooms, getRoomByCode

middlewares/

auth.js             ✅ DONE — protect (JWT verify, sets req.userId)

utils/

generateToken.js    ✅ DONE — signs { userId }, 24h expiry

generateRoomCode.js ✅ DONE — generates codes like VIBE-4821 (20-word list + padded 4-digit number)

routes/

auth.js             ✅ DONE — /signup, /login, /me (protected)

room.js             ✅ DONE — POST /, GET /my, GET /:code (all protected)

sockets/

index.js            ✅ DONE — initSockets(io), JWT middleware, all handlers wired in

state.js            ✅ DONE — in-memory rooms{} + socketRoomMap{} + all helpers + edge case guards

handlers/

roomHandlers.js     ✅ DONE — join-room, leave-room, disconnect (polished + tested)

chatHandlers.js     ✅ DONE — chat-message → broadcasts new-message (ephemeral)

playbackHandlers.js ✅ DONE — play, pause, seek, video-change, queue-add, queue-remove

server.js           ✅ DONE — wrapped with http.createServer, Socket.io attached, initSockets(io) called


## Phase 1 — Foundation ✅ COMPLETE
- [x] Express server running
- [x] MongoDB connected
- [x] User model (hashing + comparePasswords)
- [x] Room model (host as ObjectId ref to User)
- [x] Message model (room + sender refs)
- [x] Auth routes (signup, login, /me) — FULLY TESTED in Postman, all 8 test cases pass
- [x] JWT middleware (protect)
- [x] Room routes (create, my, by code) — FULLY TESTED in Postman, all cases pass

## Phase 2 — Socket.io ✅ COMPLETE

### Design Decisions Locked
- One room per socket — auto-leave old room when joining a new one
- Everyone controls playback — no host-gating
- Chats are ephemeral — NOT saved to DB, Message model deferred
- Room not found → emit `room-error` event back to that socket only
- Error event name is `room-error` (NOT `error` — that's reserved by Socket.io and causes disconnects)

### In-Memory State Structure
```js
// rooms object
"VIBE-4821": {
    users: [{ socketId, userId, username }],
    playback: { videoId: null, timestamp: 0, isPlaying: false },
    queue: [{ videoId, title }]
}

// socketRoomMap — reverse lookup, O(1)
"socketId_abc": "VIBE-4821"
```

### state.js helpers (all done)
- `addUserToRoom(roomCode, userObj)` — initializes room if new, pushes user, updates socketRoomMap
- `removeUserBySocketId(socketId)` — filters user out, deletes room if empty, cleans socketRoomMap, returns roomCode or null
- `getRoomCodeBySocketId(socketId)` — returns roomCode from socketRoomMap or null
- `getRoomState(roomCode)` — returns room or null
- `updatePlayback(roomCode, patch)` — Object.assign patch onto playback, guards for non-existent room
- `updateQueue(roomCode, newQueue)` — sets queue to new array, guards for non-existent room

### Socket Events (all implemented)
| Event | Direction | Payload | Handler |
|---|---|---|---|
| `join-room` | C → S | `{ roomCode }` | roomHandlers |
| `leave-room` | C → S | — | roomHandlers |
| `disconnect` | auto | — | roomHandlers |
| `chat-message` | C → S | `{ content }` | chatHandlers |
| `play` | C → S | `{ timestamp, isPlaying }` | playbackHandlers |
| `pause` | C → S | `{ timestamp, isPlaying }` | playbackHandlers |
| `seek` | C → S | `{ timestamp }` | playbackHandlers |
| `video-change` | C → S | `{ videoId }` | playbackHandlers |
| `queue-add` | C → S | `{ videoId, title }` | playbackHandlers |
| `queue-remove` | C → S | `{ videoId }` | playbackHandlers |

### Outgoing events from server
| Event | Direction | Payload |
|---|---|---|
| `sync-state` | S → joiner only | `{ users, playback, queue }` |
| `user-joined` | S → rest of room | `{ message }` |
| `user-left` | S → rest of room | `{ message }` |
| `new-message` | S → whole room | `{ username, message }` |
| `play/pause/seek` | S → rest of room | patch object |
| `video-changed` | S → rest of room | updated playback |
| `queue-updated` | S → rest of room | new queue array |
| `room-error` | S → that socket only | `{ message }` |

### Edge Cases Polished
- `joinRoom`: guard for room not found in DB → emit `room-error`, return
- `joinRoom`: guard for null user from DB → emit `room-error`, return
- `joinRoom`: auto-leave only broadcasts `user-left` to old room if old room still exists in memory (last user leaving deletes the room)
- `leaveRoom`: guard for null roomCode (socket not in any room) → return early
- `leaveRoom`: guard for user not found in users array → return early
- `updatePlayback`: guard for non-existent room → return early
- `updateQueue`: guard for non-existent room → return early

## REST API — Auth (DONE)
POST  /api/auth/signup   → 201, { message, details (no password), token }

POST  /api/auth/login    → 200, { message, details, token } | 401 generic on bad creds

GET   /api/auth/me       → 200, { details } | 401 if no/invalid token (protected)

## REST API — Rooms (DONE)
POST  /api/rooms          (protected) → 201, { message, details: { id, name, code } } | 400 if no name

GET   /api/rooms/my       (protected) → 200, { rooms: [{ _id, name, code, createdAt }] } sorted newest first

GET   /api/rooms/:code    (protected) → 200, { details: { name, code, host (name string) } } | 404 if not found

## Phase 3 — React Frontend 🔲 NEXT

### Important Context for Claude
The student is a backend developer doing frontend for the first time just for this project.
Go slow, explain everything, don't assume React/HTML/CSS knowledge.
Same rules apply — student writes all code, Claude explains and reviews.

### Pages needed
1. `/signup` — signup form
2. `/login` — login form
3. `/dashboard` — list of user's rooms + create room button + join room by code
4. `/room/:code` — the main room page (YouTube player + chat + queue + users list)

### Frontend Tech
- React (Vite)
- Tailwind CSS for styling
- React Router for navigation
- axios for REST API calls
- socket.io-client for WebSocket connection
- YouTube IFrame API for the player

### Key frontend concepts to establish first
- How React components work (function that returns JSX)
- useState for local state
- useEffect for side effects (socket connection, API calls)
- React Router (BrowserRouter, Routes, Route, useNavigate, useParams)
- How JWT is stored on frontend (localStorage) and sent with requests
- How socket.io-client connects (passes token in auth.token at connection time)

### Frontend folder structure (planned)
```
syncbeats-frontend/
  src/
    pages/
      Login.jsx
      Signup.jsx
      Dashboard.jsx
      Room.jsx
    components/
      Player.jsx
      Chat.jsx
      Queue.jsx
      UsersList.jsx
    hooks/
      useSocket.js      — manages socket connection + events
      useAuth.js        — reads token from localStorage, provides user info
    api/
      auth.js           — axios calls for signup/login/me
      rooms.js          — axios calls for room CRUD
    App.jsx             — router setup
    main.jsx            — entry point
```

### Socket connection on frontend
```js
// socket connects once at app level with JWT from localStorage
import { io } from 'socket.io-client'
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
})
```

## Key Things Learned So Far
- `select: false` only hides fields in fresh DB queries — in-memory documents still have them
- JWT payload kept minimal: `{ userId }`. decoded = payload + iat + exp, NOT the full user doc
- `protect` middleware: checks `Authorization: Bearer <token>` header, sets `req.userId`
- Mongoose 7+ `pre('save')` async hooks — no next() callback, just return early
- Generic auth error messages used deliberately to avoid leaking whether email is registered
- Status codes: 201 (created), 200 (success), 401 (auth failure), 404 (not found), 409 (conflict), 500 (server error)
- Route order matters in Express — specific routes before param routes
- Validate early, before DB calls
- `.populate('field', 'selectedField')` replaces ObjectId ref with actual document
- MongoDB projection limits fields at query level
- `padStart(length, char)` works on strings only
- Socket.io sits on top of ws the same way Express sits on top of raw Node http
- Socket.io middleware uses next() / next(new Error()) — no res.json()
- WebSocket upgrade (101) happens at io.connect() time — NOT at join-room
- `socket.handshake.auth.token` — raw token, no "Bearer " prefix
- Socket.io rooms are separate from app rooms — just broadcast groups
- `socket.to(room).emit()` → excludes sender. `io.to(room).emit()` → includes sender
- `error` is a reserved Socket.io event — use custom name like `room-error` instead
- `array.push()` mutates in place and returns new length, NOT the array
- `array.filter()` returns a new array — original unchanged
- `Object.assign(target, patch)` mutates target in place — only overwrites fields present in patch
- `socket.broadcast.to()` and `socket.to()` are identical
- State helpers should be a dumb data layer — no socket access, no side effects
- Guard for "last user leaves" case — room gets deleted before broadcast fires

## Future Ideas (deferred)
- Public/private rooms with optional password
- "Pick from 3 generated codes" at room creation
- Persistent chat history using Message model

## Rules We're Following
- Student writes all code himself for confidence and learning
- Claude explains WHY, reviews code, helps when stuck — does NOT write code for student
- Commit after every small working thing
- One task at a time
