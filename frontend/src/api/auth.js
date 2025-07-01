// src/api/auth.js
import api from './api';

// Register
export const register = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

// Verify Email
export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify-email?token=${token}`);
  return res.data;
};

// Login
export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

// Reset Password
export const resetPassword = async ({token, password}) => {
  const res = await api.post('/auth/reset-password', { token, password });
  return res.data;
};

// Logout (optional: just clear context/localStorage)
export const logout = async () => {
  try {
    const res = await api.post('/auth/logout'); // Optional backend call
    return res.data;
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return { message: 'Logout failed' }; // Or silent fallback
  }
};
