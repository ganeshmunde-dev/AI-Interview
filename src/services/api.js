// src/services/api.js
// Axios instance pre-wired for Spring Boot backend (Phase 2)
// Currently uses mock data, swap to real API calls in Phase 2

import axios from 'axios';
import { LS_KEYS, API_BASE_URL } from '@/constants/appConstants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(LS_KEYS.TOKEN);
      localStorage.removeItem(LS_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  },
);

// ── Auth Endpoints (Phase 2) ───────────────────────────────────────────────
export const authAPI = {
  login:    (data)  => api.post('/auth/login', data),
  register: (data)  => api.post('/auth/register', data),
  logout:   ()      => api.post('/auth/logout'),
  profile:  ()      => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// ── Interview Endpoints (Phase 2) ─────────────────────────────────────────
export const interviewAPI = {
  getQuestions: (config) => api.post('/interview/questions', config),
  submitAnswers: (data)  => api.post('/interview/submit', data),
  getHistory:   ()       => api.get('/interview/history'),
  getResult:    (id)     => api.get(`/interview/result/${id}`),
  deleteSession: (id)    => api.delete(`/interview/${id}`),
};

// ── User Endpoints (Phase 2) ───────────────────────────────────────────────
export const userAPI = {
  getProfile:    ()     => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  uploadAvatar:  (form) => api.post('/user/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume:  (form) => api.post('/user/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;
