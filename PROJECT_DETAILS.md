# Campus Lost & Found Portal — Project Details

## Project Summary
The Campus Lost & Found Portal is a full-stack web application that allows users to report lost or found campus items, communicate through private anonymous chat rooms, and manage listings with role-based access. The portal supports admin-only statistics and global room visibility.

## Core Modules

### Frontend
The client is a Vite + React single-page application. It contains route-based pages for authentication, dashboard, lost and found reporting, chat, my listings, and admin overview.

Files:
- client/src/main.jsx
- client/src/App.jsx
- client/src/context/AuthContext.jsx
- client/src/pages/*
- client/src/components/*

### Backend
The backend is an Express server that hosts JSON APIs for authentication, items, chat, and admin overview. It also starts a Socket.IO server for real-time private messaging.

Files:
- server/server.js
- server/routes/authRoutes.js
- server/routes/itemRoutes.js
- server/routes/chatRoutes.js
- server/routes/adminRoutes.js
- server/middleware/auth.js
- server/socket.js

### Data Store
The application uses an in-memory store file that seeds users, items, rooms, and messages for local development. This is a sample data model and is suitable for the demo environment.

Files:
- server/data/store.js

## Runtime and Development Tools

### Root Runtime
- Node.js
- Express
- Socket.IO
- JWT
- bcryptjs
- dotenv
- cors
- mongoose (project schema model structure prepared, but memory store is used locally)

### Client Runtime
- React
- Vite
- React Router
- Axios
- Socket.IO Client
- Lucide Icons

### Development Utilities
- npm
- nodemon
- Python HTTP check commands for smoke testing

## Project Structure

project_F/
├── package.json
├── README.md
├── PROJECT_DETAILS.md
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       ├── context/
│       └── pages/
└── server/
    ├── server.js
    ├── socket.js
    ├── data/store.js
    ├── middleware/auth.js
    ├── models/
    └── routes/

## Authentication and Authorization Model
- Registration creates a standard student account and ignores any client-supplied role.
- Login calls the JWT route and returns a token and sanitized user object.
- Routes use requireAuth middleware and requireAdmin middleware for secure access.
- Admin-only protection exists in the React ProtectedRoute component.

## Chat Model
The chat route creates a room from the item id, claimant id, and owner id. A room can be opened by any logged-in user associated with the item. Admin users are allowed to view all rooms, while student users only see their own rooms.

## Admin Model
The dedicated admin route exposes `/api/admin/overview` for campus totals and uses the chat room length from the default in-memory room array.

## Project Workflow
1. Install dependencies in the root workspace.
2. Install client dependencies in the client folder.
3. Start the Express server.
4. Start the Vite client.
5. Open the frontend at localhost:5173, with backend at localhost:5000.
