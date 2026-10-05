// src/data/users.js
// Mock user data

export const mockUser = {
  id: 'usr-001',
  name: 'Rahul Munde',
  email: 'rahul.munde@example.com',
  avatar: null,             // will use initials fallback
  role: 'Java Full Stack Developer',
  experience: '2 years',
  location: 'Pune, Maharashtra',
  phone: '+91 98765 43210',
  bio: 'Passionate Java Full Stack Developer learning Spring Boot and React. Aiming for product-based companies.',
  skills: ['Java', 'Spring Boot', 'React', 'MySQL', 'Git', 'REST APIs', 'HTML/CSS', 'JavaScript'],
  education: [
    {
      id: 'edu-1',
      degree: 'B.E. Computer Engineering',
      institute: 'Savitribai Phule Pune University',
      year: '2022 – 2026',
      grade: '8.5 CGPA',
    },
  ],
  certifications: [
    { id: 'cert-1', name: 'Java SE 11 Developer', issuer: 'Oracle', year: '2024' },
    { id: 'cert-2', name: 'React Fundamentals',   issuer: 'Meta',   year: '2024' },
  ],
  achievements: [
    { id: 'ach-1', title: '🥇 Top 10% in Java Quiz', desc: 'HackerRank Java Challenge 2024' },
    { id: 'ach-2', title: '🏆 Hackathon Winner',     desc: 'State Level Hackathon 2023' },
    { id: 'ach-3', title: '⭐ 5-Star Java Rating',   desc: 'HackerRank Platform' },
  ],
  stats: {
    totalInterviews: 24,
    avgScore: 72,
    bestScore: 94,
    streak: 5,
  },
  joined: '2024-01-15',
};

export const mockAuthUser = {
  token: 'mock-jwt-token-xyz-abc-123',
  user: mockUser,
};
