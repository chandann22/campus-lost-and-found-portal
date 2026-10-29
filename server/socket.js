import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { chatRooms, messages } from './data/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campus-secret-local';

export function registerSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization || '';
    const cleanToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;

    if (!cleanToken) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(cleanToken, JWT_SECRET);
      socket.user = { id: payload.id, role: payload.role, name: payload.name || 'Anonymous User' };
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
  if (typeof roomId !== 'string') return;

  const room = chatRooms.find(r => r.id === roomId);
  if (!room) return;

  const isAdmin = socket.user.role === 'admin';
  const isMember = room.ownerId === socket.user.id || room.claimantId === socket.user.id;
  if (!isAdmin && !isMember) return;

  socket.join(roomId);
});

    socket.on('send-message', (payload) => {
      const { roomId, body } = payload;
      const room = chatRooms.find(r => r.id === roomId);
      if (!room || !body) return;

      const isAdmin = socket.user.role === 'admin';
      const isOwner = socket.user.id === room.ownerId;
      const isClaimant = socket.user.id === room.claimantId;
      if (!isAdmin && !isOwner && !isClaimant) return;

      let senderType = 'claimant';
      let maskedSender = 'Finder #482';

      if (isAdmin) {
        senderType = 'admin';
        maskedSender = 'Campus Admin';
      } else if (isOwner) {
        senderType = 'owner';
        maskedSender = 'Owner #958';
      }

      const msg = {
        id: `message-${Date.now()}`,
        roomId,
        senderId: socket.user.id,
        senderType,
        body,
        createdAt: new Date().toISOString(),
        maskedSender
      };

      messages.push(msg);
      io.to(roomId).emit('new-message', msg);
    });
  });
}
