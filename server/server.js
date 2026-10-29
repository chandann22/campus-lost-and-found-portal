import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { registerSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

registerSocket(io);

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`Campus Lost & Found API started at http://localhost:${PORT}`);
});
