import express from 'express';
import { items, users, chatRooms } from '../data/store.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', requireAuth, requireAdmin, (req, res) => {
  res.json({
    stats: {
      items: items.length,
      users: users.length,
      rooms: chatRooms.length
    }
  });
});

export default router;
