import React, { useEffect, useState } from 'react';
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendsList,
  getPendingFriendRequests
} from '../api/profile';
import { searchUsers } from '../api/profile';
import { useSocket } from '../context/SocketContext';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const socket = useSocket();

  const loadFriends = async () => {
    const list = await getFriendsList();
    setFriends(list);
  };

  const loadPending = async () => {
    const reqs = await getPendingFriendRequests();
    setPending(reqs);
  };

  useEffect(() => {
    loadFriends();
    loadPending();
  }, []);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (data) => {
      if (data.type === 'friend_request') {
        loadPending();
      }
      if (data.type === 'friend_accept') {
        loadFriends();
      }
    });

    socket.on('friendsListUpdated', () => {
      loadFriends();
    });

    socket.on('friendRequestDeclined', () => {
      loadPending();
    });

    return () => {
      socket.off('notification');
      socket.off('friendsListUpdated');
      socket.off('friendRequestDeclined');
    };
  }, [socket]);

  const handleAccept = async (friendshipId) => {
    await acceptFriendRequest(friendshipId);
    loadFriends();
    loadPending();
  };

  const handleDecline = async (friendshipId) => {
    await declineFriendRequest(friendshipId);
    loadPending();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = await searchUsers(searchQuery);
    setSearchResults(results);
  };

  const handleSendRequest = async (userId) => {
    await sendFriendRequest(userId);
    // remove from search results instantly
    setSearchResults((prev) => prev.filter((u) => u._id !== userId));
    loadPending();
  };

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {friends.map((f) => (
          <li key={f._id}>{f.username}</li>
        ))}
      </ul>

      <h2>Pending Requests</h2>
      <ul>
        {pending.map((req) => (
          <li key={req._id}>
            {req.requester.username}
            <button onClick={() => handleAccept(req._id)}>Accept</button>
            <button onClick={() => handleDecline(req._id)}>Decline</button>
          </li>
        ))}
      </ul>

      <h2>Find Friends</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search by username"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => handleSendRequest(user._id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
