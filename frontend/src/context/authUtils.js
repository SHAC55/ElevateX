// src/auth/authUtils.js
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  // Clear other auth-related items if needed
};

export const setAccessToken = (token) => {
  localStorage.setItem('accessToken', token);
};