import React from 'react';

export default function UserProfileModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // click outside closes modal
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg"
        onClick={e => e.stopPropagation()} // prevent closing on content click
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Close profile modal"
        >
          &times;
        </button>

        <img
          src={user.profilePicture || '/default-avatar.png'}
          alt={user.username}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-center mb-2">{user.username}</h2>

        {/* You can add more details here, e.g., email, bio, etc. */}
      </div>
    </div>
  );
}
