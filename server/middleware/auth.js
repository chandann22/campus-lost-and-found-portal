import jwt from 'jsonwebtoken';
import { users, sanitizeUser } from '../data/store.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'campus-secret-local');
    const user = users.find(item => item.id === payload.id);

    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = sanitizeUser(user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}
