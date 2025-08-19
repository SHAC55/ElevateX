import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import dp from "../../assets/dp.png";

const ProfilePictureWithZoom = ({ profile, preview }) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const handleZoomOpen = () => {
    setZoomVisible(true);
    setTimeout(() => setZoomed(true), 10);
  };

  const handleZoomClose = () => {
    setZoomed(false);
    setTimeout(() => setZoomVisible(false), 300);
  };

  return (
    <>
      {/* Premium Zoom Overlay */}
      <AnimatePresence>
        {zoomVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: zoomed ? 1 : 0 }}
            exit={{ opacity: 0 }}
            onClick={handleZoomClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Gradient Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: zoomed ? 0.9 : 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-pink-900/80 backdrop-blur-xl"
            />
            
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={handleZoomClose}
              className="absolute top-6 right-6 z-10 p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all border border-white/20"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes className="w-6 h-6" />
            </motion.button>
            
            {/* Fixed Size Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: zoomed ? 1 : 0.9, 
                opacity: zoomed ? 1 : 0,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-[min(90vw,500px)] h-[min(90vw,500px)] max-w-[90vh] max-h-[90vh]"
            >
              {/* Main Image */}
              <motion.img
                src={preview || profile.profilePicture || dp}
                alt="Profile Zoomed"
                onClick={(e) => e.stopPropagation()}
                className="w-full h-full object-contain rounded-2xl shadow-2xl z-20 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: zoomed ? 1 : 0, 
                  scale: zoomed ? 1 : 0.95,
                }}
              />
              
              {/* Glowing Border */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: zoomed ? 1 : 0, 
                  scale: zoomed ? 1 : 0.95,
                }}
                className="absolute inset-0 rounded-2xl overflow-hidden p-[2px] z-10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-500 to-pink-500 animate-gradient-xy blur-md" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Profile Picture */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex-shrink-0 cursor-zoom-in group"
        onClick={handleZoomOpen}
        title="Click to zoom"
      >
        {/* Profile Image Container */}
        <div className="relative z-20">
          <motion.img
            src={preview || profile.profilePicture || dp}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl dark:border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        </div>
        
        {/* Floating Frame (behind the image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 rounded-full overflow-hidden p-[2px] z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-blue-500 to-pink-500 rounded-full animate-gradient-xy blur-sm" />
        </motion.div>
        
        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center z-30"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
          >
            <FaSearch className="text-white text-xl" />
          </motion.div>
        </motion.div>
        
        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white shadow-lg z-0"
            initial={{ 
              scale: 0,
              opacity: 0,
              x: Math.random() * 40 - 20,
              y: Math.random() * 40 - 20
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

export default ProfilePictureWithZoom;