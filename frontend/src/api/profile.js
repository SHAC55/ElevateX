import api from './api';

// ============================
// PROFILE
// ============================

// Get another user's profile (pass userId)
export const getProfile = async (userId = 'me') => {
  const res = await api.get(`/profile/${userId}`);
  return res.data;
};

// Update own profile
export const updateProfile = async (data) => {
  const res = await api.put('/profile', data);
  return res.data;
};

// Upload profile picture
export const uploadProfilePicture = async (formData) => {
  const res = await api.post('/profile/upload-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
export const deleteProfilePicture = async () => {
  const res = await api.delete('/profile/picture');
  return res.data;
};

// ============================
// FRIENDS
// ============================

// Send request still uses USER ID
// export const sendFriendRequest = async (userId) => {
//   const res = await api.post(`/friends/request/${userId}`);
//   return res.data;
// };

// Accept & decline now use FRIENDSHIP ID
export const acceptFriendRequest = async (friendshipId) => {
  const res = await api.post(`/friends/accept/${friendshipId}`);
  return res.data;
};

export const declineFriendRequest = async (friendshipId) => {
  const res = await api.post(`/friends/decline/${friendshipId}`);
  return res.data;
};

// Friends list
export const getFriendsList = async () => {
  const res = await api.get('/friends');
  return res.data;
};

// Pending requests
export const getPendingFriendRequests = async () => {
  const res = await api.get('/friends/requests');
  return res.data;
};
export const searchUsers = async (query) => {
  const res = await api.get(`/friends/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
export const removeFriend = async (friendId) => {
  const res = await api.delete(`/friends/${friendId}`);
  return res.data;
};

export const sendFriendRequest = async (friendId) => {
  const res = await api.post(`/friends/request/${friendId}`);
  return res.data;
};


