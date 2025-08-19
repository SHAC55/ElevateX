

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserFriends, FaUserClock, FaLink, FaEnvelope, FaUser } from "react-icons/fa";
import ProfilePictureWithZoom from "./ProfilePictureWithZoom";
import ActionButtons from "./ActionButtons";
import SocialLinks from "./SocialLinks";
import FriendsModal from "./FriendsModal";
import EditProfile from "./EditProfile";
import { getFriendsList, getPendingFriendRequests } from "../../api/profile";
import { useSocket } from "../../hooks/useSocket";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProfileInfo = ({ profile, reloadProfile }) => {
  const { user } = useAuth();
  const { socket, on, emit } = useSocket();
  const [editMode, setEditMode] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const containerRef = useRef(null);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!on || !user) return;

    const handleNewRequest = (data) => {
      toast.success(`New friend request from ${data.sender.username}`);
    };

    const handleRequestAccepted = (data) => {
      toast.success(`${data.recipient.username} accepted your friend request!`);
    };

    const handleFriendsListUpdated = () => {
      refreshCounts();
    };

    emit('join_user_channel', { userId: user.id });
    on('friend_request_received', handleNewRequest);
    on('friend_request_accepted', handleRequestAccepted);
    on('friendsListUpdated', handleFriendsListUpdated);

    return () => {
      if (emit) {
        emit('leave_user_channel', { userId: user.id });
      }
    };
  }, [on, emit, user]);

  useEffect(() => {
    refreshCounts();
  }, []);

  const refreshCounts = async () => {
    try {
      const friendsList = await getFriendsList();
      setFriendsCount(friendsList.length);
      const pendingList = await getPendingFriendRequests();
      setPendingCount(pendingList.length);
    } catch (err) {
      console.error("Failed to load counts", err);
    }
  };

  const handleSave = (updatedForm) => {
    setEditMode(false);
    reloadProfile();
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden rounded-2xl z-0"
      >
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-rose-500/10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-transparent dark:from-gray-900/70 backdrop-blur-sm" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-6 md:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/30 dark:border-gray-700/50 z-10"
      >
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-center">
          <div className="flex-shrink-0">
            <ProfilePictureWithZoom profile={profile} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {/* Username */}
            <motion.h2
              className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {profile.username}
            </motion.h2>
            
            {/* Email */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-600 dark:text-gray-300">
              <FaEnvelope className="text-blue-500" />
              <span>{profile.email}</span>
            </div>
            
            {/* User ID */}
          
            
            {/* Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 max-w-xs"
            />
            
            {/* Action Buttons */}
            <div className="mt-6">
              <ActionButtons 
                openModal={openModal} 
                setEditMode={setEditMode}
                friendsCount={friendsCount}
                pendingCount={pendingCount}
              />
            </div>
          </div>
        </div>

        {/* Friends & Connections Section */}
        {!editMode && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaUserFriends className="text-blue-500 text-xl" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Friends & Connections
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-purple-500/30 ml-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-800/30 p-5 rounded-xl border border-white/30 dark:border-gray-700/50 shadow-sm cursor-pointer"
                onClick={() => openModal("friends")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <FaUserFriends className="text-blue-500" />
                      Your Friends
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                      People you're connected with
                    </p>
                  </div>
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {friendsCount}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-gray-800/50 dark:to-gray-800/30 p-5 rounded-xl border border-white/30 dark:border-gray-700/50 shadow-sm cursor-pointer"
                onClick={() => openModal("pending")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <FaUserClock className="text-amber-500" />
                      Pending Requests
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                      Waiting for your approval
                    </p>
                  </div>
                  <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {pendingCount}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Social Links Section */}
        {!editMode && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaLink className="text-emerald-500 text-xl" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Your Social Presence
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-teal-500/30 ml-3" />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                Connect your social profiles to share your achievements and collaborate with others
              </p>
              <SocialLinks links={profile.links} />
            </div>
          </motion.section>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editMode && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <EditProfile
              initialUsername={profile.username}
              initialLinks={profile.links}
              onCancel={() => setEditMode(false)}
              onSave={handleSave}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Friends Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <FriendsModal
              showModal={showModal}
              setShowModal={setShowModal}
              modalType={modalType}
              refreshCounts={refreshCounts}
              socket={{ on, emit }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileInfo;