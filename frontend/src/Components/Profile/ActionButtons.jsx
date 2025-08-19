import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaUserFriends, FaUserClock } from "react-icons/fa";

const buttonHover = { scale: 1.05, transition: { duration: 0.2 } };
const buttonTap = { scale: 0.98 };

const ActionButtons = ({ openModal, setEditMode, friendsCount, pendingCount }) => {
  return (
    <div className="flex items-center space-x-6">
      <motion.button
        whileHover={buttonHover}
        whileTap={buttonTap}
        onClick={() => setEditMode(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
        type="button"
      >
        <FaEdit className="w-5 h-5 drop-shadow-md" />
        <span>Edit Profile</span>
      </motion.button>


      <motion.button
        whileHover={buttonHover}
        whileTap={buttonTap}
        onClick={() => openModal("find")}
        type="button"
        className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        <FaUserFriends className="w-5 h-5" />
        <span className="font-medium">Find Friends</span>
      </motion.button>
    </div>
  );
};

export default ActionButtons;
