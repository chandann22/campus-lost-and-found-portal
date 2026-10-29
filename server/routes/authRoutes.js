import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, sanitizeUser } from '../data/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'campus-secret-local';

router.post('/register', (req, res) => {
  const { name, email, password, department } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });

  if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'student',
    department: department || 'General',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({ token, user: sanitizeUser(newUser) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(item => item.email.toLowerCase() === (email || '').toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: sanitizeUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
