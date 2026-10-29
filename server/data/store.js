import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export const users = [
  {
    id: 'user-admin-1',
    name: 'Campus Admin',
    email: 'admin@campus.edu',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    department: 'Administration',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-student-1',
    name: 'Student Alpha',
    email: 'student@campus.edu',
    passwordHash: bcrypt.hashSync('student123', 10),
    role: 'student',
    department: 'Computer Science',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-student-2',
    name: 'Student Beta',
    email: 'finder@campus.edu',
    passwordHash: bcrypt.hashSync('finder123', 10),
    role: 'student',
    department: 'IT Services',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-student-3',
    name: 'Student Gamma',
    email: 'design@campus.edu',
    passwordHash: bcrypt.hashSync('design123', 10),
    role: 'student',
    department: 'Design & Media',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-student-4',
    name: 'Student Delta',
    email: 'library@campus.edu',
    passwordHash: bcrypt.hashSync('library123', 10),
    role: 'student',
    department: 'Library Science',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-student-5',
    name: 'Student Epsilon',
    email: 'lab@campus.edu',
    passwordHash: bcrypt.hashSync('lab123', 10),
    role: 'student',
    department: 'Engineering Lab',
    createdAt: new Date().toISOString()
  }
];

export const items = [
  {
    id: 'item-lost-1',
    itemType: 'lost',
    title: 'Black Leather Backpack',
    category: 'Bag',
    description: 'Lost black backpack with a blue notebook inside near the central library stairwell.',
    location: 'Library',
    date: '2026-09-12',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
    ownerId: 'user-student-1',
    reporterName: 'Student Alpha',
    reporterDisplayName: 'Student Alpha',
    contactInfo: 'No direct contact shown publicly.',
    privacyMode: 'masked',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-found-1',
    itemType: 'found',
    title: 'Blue USB Drive',
    category: 'Electronics',
    description: 'Found a blue USB drive near the computer lab terminal area.',
    location: 'Computer Lab',
    date: '2026-09-11',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    ownerId: 'user-student-2',
    reporterName: 'Student Beta',
    reporterDisplayName: 'Student Beta',
    contactInfo: 'No direct contact shown publicly.',
    privacyMode: 'masked',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-lost-2',
    itemType: 'lost',
    title: 'ID Card Holder',
    category: 'Identity',
    description: 'Student ID card holder with campus pulse link and a gold chain.',
    location: 'Student Center',
    date: '2026-09-10',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49',
    ownerId: 'user-student-2',
    reporterName: 'Student Beta',
    reporterDisplayName: 'Student Beta',
    contactInfo: 'No direct contact shown publicly.',
    privacyMode: 'masked',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const chatRooms = [
  {
    id: 'room-item-lost-1-user-student-1-user-student-2',
    itemId: 'item-lost-1',
    ownerId: 'user-student-1',
    claimantId: 'user-student-2',
    createdAt: new Date().toISOString(),
    isAnonymous: true
  }
];

export const messages = [
  {
    id: 'message-1',
    roomId: 'room-item-lost-1-user-student-1-user-student-2',
    senderId: 'user-student-2',
    senderType: 'claimant',
    body: 'I found the backpack in the library. Can we coordinate?',
    createdAt: new Date().toISOString(),
    maskedSender: 'Finder #482'
  }
];

export function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    createdAt: user.createdAt
  };
}

export function generateRoomId(itemId, claimantId, ownerId) {
  return `room-${itemId}-${claimantId}-${ownerId}`;
}

export function createRoomForItem(itemId, claimantId, ownerId) {
  const room = {
    id: generateRoomId(itemId, claimantId, ownerId),
    itemId,
    ownerId,
    claimantId,
    createdAt: new Date().toISOString(),
    isAnonymous: true
  };

  const existing = chatRooms.find(r => r.id === room.id);
  if (!existing) chatRooms.push(room);

  return room;
}
