import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import FriendsTab from "./FriendsTab";

const FriendsModal = ({ showModal, setShowModal, modalType, refreshCounts, socket }) => (
  <AnimatePresence>
    {showModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden dark:bg-gray-800"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold dark:text-gray-200">
              {modalType === "friends"
                ? "Friends"
                : modalType === "pending"
                ? "Friend Requests"
                : "Find Friends"}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded"
            >
              <FaTimes />
            </button>
          </div>
          <FriendsTab
            type={modalType}
            onClose={() => setShowModal(false)}
            onCountsChange={refreshCounts}
            socket={socket}
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FriendsModal;
