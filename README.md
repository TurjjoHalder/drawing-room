# 3D Scene Studio

A full-stack 3D web application for placing and managing objects in an interactive 3D room, built with React, Three.js, Express, and MongoDB.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| 3D Engine | Three.js via @react-three/fiber + @react-three/drei |
| State Management | Zustand |
| Backend | Express.js |
| Database | MongoDB + Mongoose |
| Sessions | express-session + connect-mongo |
| Routing | React Router v6 |

---

## Features

- **Authentication**: Signup/login with bcrypt-hashed passwords, server-side sessions via MongoDB
- **3D Scene**: Interactive room with grid floor, ambient/directional lighting, stars background
- **Object Types**: Cube, Sphere, Cylinder, Torus, Cone (procedural) + Duck & Robot (GLTF models from Khronos Sample Models)
- **Drag & Drop**: Smooth drag on horizontal plane using raycasting; pointer capture for reliable dragging
- **Visual Feedback**: Objects scale up when dragged, glow when selected, rotate when selected
- **Save/Load**: Scene persists to MongoDB; auto-loads on every login
- **Delete**: Select an object + click Delete button to remove it
- **Camera Controls**: Orbit (right-click drag), pan (middle mouse), zoom (scroll)

---

## Project Structure

```
3d-scene-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SceneCanvas.jsx      # Three.js canvas setup
│   │   │   ├── SceneObject.jsx      # Individual 3D object with drag logic
│   │   │   ├── RoomEnvironment.jsx  # Floor, walls, grid
│   │   │   ├── SceneHUD.jsx         # UI overlay (Add Objects, Save, etc.)
│   │   │   └── AddObjectDialog.jsx  # Object picker dialog
│   │   ├── hooks/
│   │   │   ├── useAuthStore.js      # Zustand auth state + API calls
│   │   │   └── useSceneStore.js     # Zustand scene state + API calls
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx         # Login/Signup page
│   │   │   └── ScenePage.jsx        # Main 3D scene page
│   │   └── styles/                  # CSS modules per component
│   └── vite.config.js
│
└── server/                  # Express backend
    ├── models/
    │   ├── User.js          # Mongoose User schema (bcrypt)
    │   └── Scene.js         # Mongoose Scene schema
    ├── routes/
    │   ├── auth.js          # /api/auth - signup, login, logout, me
    │   └── scene.js         # /api/scene - GET (load), POST (save)
    ├── middleware/
    │   └── auth.js          # requireAuth middleware
    └── index.js             # Express app entry point
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Clone and install all dependencies
git clone <your-repo-url>
cd 3d-scene-app
npm run install:all
```

### Configure Environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and session secret

# Client (optional for local dev)
cp client/.env.example client/.env
```

### Run in Development

```bash
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:5000
```

---

## Deployment (Vercel + MongoDB Atlas)

1. Push to GitHub
2. Create [MongoDB Atlas](https://cloud.mongodb.com) cluster → get connection string
3. Deploy to [Vercel](https://vercel.com):
   - Import repo
   - Add environment variables:
     - `MONGODB_URI` — your Atlas connection string
     - `SESSION_SECRET` — a random 32+ char string
     - `CLIENT_URL` — your Vercel deployment URL
     - `NODE_ENV` — `production`
4. Update `CLIENT_URL` in server env to match your deployed frontend URL

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/scene` | Yes | Load user's scene |
| POST | `/api/scene` | Yes | Save user's scene |

---

## Controls

| Action | Control |
|--------|---------|
| Move object | Left-click drag |
| Orbit camera | Right-click drag |
| Zoom | Scroll wheel |
| Pan | Middle mouse drag |
| Select object | Click |
| Delete object | Select → Delete button |

---

## Challenges & Design Decisions

### Drag & Drop in 3D
The core challenge is converting 2D mouse position to 3D world coordinates. The solution uses a virtual horizontal plane (`THREE.Plane`) positioned at the object's Y level, then raycasting to find the intersection point on that plane. Pointer capture (`setPointerCapture`) ensures the drag continues even when the cursor leaves the canvas.

### GLTF Models
The Duck and Robot use freely-available Khronos Sample Models loaded directly from their GitHub CDN. Models are preloaded at startup to avoid lag.

### Session + CORS
Express sessions require `credentials: 'include'` on all fetch calls client-side, and the server CORS must be configured with `credentials: true` and an explicit origin (not `*`).

### Vercel Deployment
Deploying a monorepo (React + Express) to Vercel requires the `vercel.json` config to route `/api/*` to the Express function and everything else to the built static assets.
