import express from 'express';
import { items, users } from '../data/store.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ items });
});

router.get('/my-listings', requireAuth, (req, res) => {
  const userItems = items.filter(item => item.ownerId === req.user.id);
  res.json({ items: userItems });
});

router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ item });
});

router.post('/', requireAuth, (req, res) => {
  const { title, category, description, itemType, location, date, imageUrl } = req.body;
  if (!title || !category || !description || !itemType || !location || !date) {
    return res.status(400).json({ message: 'Missing required item fields' });
  }

  const newItem = {
    id: `item-${Date.now()}`,
    itemType,
    title,
    category,
    description,
    location,
    date,
    status: 'open',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    ownerId: req.user.id,
    reporterName: req.user.name,
    reporterDisplayName: req.user.name,
    contactInfo: 'No direct contact shown publicly.',
    privacyMode: 'masked',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  items.push(newItem);
  res.status(201).json({ item: newItem });
});

router.put('/:id', requireAuth, (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only edit your own listings' });
  }

  Object.assign(item, req.body, { updatedAt: new Date().toISOString() });
  res.json({ item });
});

router.delete('/:id', requireAuth, (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  if (item.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You can only delete your own listings' });
  }

  const idx = items.indexOf(item);
  items.splice(idx, 1);
  res.json({ message: 'Item deleted' });
});

export default router;
