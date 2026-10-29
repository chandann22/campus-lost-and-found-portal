import express from 'express';
import { items, chatRooms, messages, generateRoomId } from '../data/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/rooms', requireAuth, (req, res) => {
  const rooms = req.user.role === 'admin'
    ? chatRooms
    : chatRooms.filter(room => room.ownerId === req.user.id || room.claimantId === req.user.id);

  res.json({ rooms });
});

router.post('/initiate', requireAuth, (req, res) => {
  const { itemId, ownerId, claimantId } = req.body;
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const roomId = generateRoomId(itemId, claimantId, ownerId);
  let room = chatRooms.find(r => r.id === roomId);

  if (!room) {
    room = {
      id: roomId,
      itemId,
      ownerId,
      claimantId,
      createdAt: new Date().toISOString(),
      isAnonymous: true
    };
    chatRooms.push(room);
  }

  const roomMessages = messages.filter(m => m.roomId === room.id);
  res.json({ room, messages: roomMessages });
});

router.get('/messages/:roomId', requireAuth, (req, res) => {
  const room = chatRooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (req.user.role !== 'admin' && req.user.id !== room.ownerId && req.user.id !== room.claimantId) {
    return res.status(403).json({ message: 'Room access denied' });
  }

  res.json({ messages: messages.filter(m => m.roomId === req.params.roomId) });
});

export default router;
