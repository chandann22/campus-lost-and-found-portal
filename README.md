# Campus Lost & Found Portal

A complete MERN-style lost and found campus portal with authentication, protected route handling, anonymous private chat, and field-separated item pages.

## Features

- JWT register/login flow.
- Protected routes for dashboard, lost, found, my-listings, chat, and admin.
- Item creation, editing, deletion, and listing filtering by field.
- Anonymous private chat rooms using Socket.IO.
- Privacy-first UI with masked reporter identities.
- Admin-only overview exposed through `/api/admin/overview`.
- Secure registration that always creates a student account instead of accepting a client-supplied role value.

## Tools and Tech Stack

### Backend

- Node.js
- Express.js
- Socket.IO
- JWT
- bcryptjs
- cors
- dotenv

### Frontend

- React
- Vite
- React Router
- Axios
- Socket.IO Client
- Lucide Icons

### Data and Project Flow

- In-memory seeded object store for demo users, listings, rooms, and messages.
- `npm` scripts for development and production build flow.

## User Manual

### 1. Accessing the Portal

1. Install dependencies in the root workspace:

```bash
npm install
```

2. Install the Vite React client dependencies:

```bash
npm --prefix client install
```

3. Start the Express API server:

```bash
npm run start
```

4. In a second terminal, start the Vite client:

```bash
npm --prefix client run dev
```

The front end runs at http://localhost:5173 and the API runs at http://localhost:5000.

### 2. Account Flow

- Open the portal at http://localhost:5173.
- Register a new account from the Register page.
- Login with the seeded sample accounts:
  - Admin: admin@campus.edu / admin123
  - Student Alpha: student@campus.edu / student123
  - Student Beta: finder@campus.edu / finder123
  - Student Gamma: design@campus.edu / design123
  - Student Delta: library@campus.edu / library123
  - Student Epsilon: lab@campus.edu / lab123

The client reads the API base URL from the shared client helper. In local development the base path is http://localhost:5000, and the client uses that single address when calling /api routes.

### 3. Dashboard

After login, the user is taken to the dashboard with the main portal statistics and quick links. The dashboard shows the latest listings and field shortcuts.

### 4. Lost and Found Fields

- Lost Page: report lost objects and browse the lost-item feed.
- Found Page: report found objects and browse the found-item feed.
- The listing workflow is field-separated so a user can create and view lost reports independently of found reports.

### 5. My Listings

Every authenticated user can manage their own reports under the My Listings page. Users can create, update, and delete their own listings. Admins can also manage all listings.

### 6. Anonymous Chat

- From any lost or found card, use the Chat with Reporter button to open a private Socket.IO chat room.
- Chat rooms are created from the room key built from the item id, claimant id, and owner id.
- User privacy is preserved by showing masked names such as Finder #482 or Claimant #109 instead of personal contact details.
- Admin users can fetch the full room list and open any room for moderation or oversight.

### 7. Admin Flow

- Admin-only access is provided at the Admin page.
- The admin role can view the campus-wide overview and manage the portal.
- The admin overview route is served by `/api/admin/overview` and reports items, users, and rooms.

## Project Structure

```text
Item-Lost&Found_Portal-Project/
├── README.md
├── PROJECT_DETAILS.md
├── package.json
├── client/
│   ├── package.json
│   ├── src/
│   └── vite.config.js
└── server/
    ├── server.js
    ├── socket.js
    ├── data/store.js
    ├── middleware/auth.js
    ├── models/
    └── routes/
```

## Flow of the Application
The current demo uses an in-memory data store, so seeded and newly created data resets when the API restarts. MongoDB models are included as a starting point but are not connected to the running data flow.


1. Users register or log in through the React client and receive a JWT token.
2. The UI fetches and posts item data through the Express `/api/items` endpoints.
3. Lost and found pages create chat rooms through `/api/chat/initiate`.
4. Socket.IO pushes real-time messages into the selected room.
5. Admin screens fetch `/api/admin/overview` for statistics and room counts.

## Quick start

```bash
npm install
npm run start
```

For the client:

```bash
npm --prefix client install
npm --prefix client run dev
```
