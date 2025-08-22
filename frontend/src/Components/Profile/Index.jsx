import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProfile } from "../../api/profile";
import ProfileInfo from "./ProfileInfo";
import { FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { Loader2 } from "lucide-react";

/* --------------------------------- Spinner -------------------------------- */
function Spinner({ label = "Loading...", className = "h-10 w-10 text-blue-500" }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`${className} animate-spin`} aria-hidden="true" />
      {label ? (
        <motion.p
          initial={{ y: 6, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-gray-500 dark:text-gray-400"
        >
          {label}
        </motion.p>
      ) : null}
    </div>
  );
}

/* --------------------------- Floating particle UI -------------------------- */
const FloatingParticle = ({ size, left, top, duration, delay, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, left: `${left}%`, top: `${top}%`, backgroundColor: color }}
    animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.7, 0.3, 0.7] }}
    transition={{ duration, repeat: Infinity, repeatType: "reverse", delay, ease: "easeInOut" }}
  />
);

const BackgroundAnimation = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => {
    const size = `${Math.random() * 10 + 5}px`;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const hue = Math.floor(Math.random() * 360);
    const color = `hsla(${hue}, 70%, 80%, ${Math.random() * 0.2 + 0.1})`;
    return <FloatingParticle key={i} size={size} left={left} top={top} duration={duration} delay={delay} color={color} />;
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {particles}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)",
            "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
};

/* --------------------------------- Profile -------------------------------- */
const Profile = ({ reloadProfile: parentReload }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProfile("me");
      setProfile(res);
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProfile();
    if (parentReload) parentReload();
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundAnimation />

      <div className="relative z-10">
        {loading && !isRefreshing ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <Spinner label="Loading your profile..." />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-4 text-yellow-500"
            >
              <FiAlertTriangle size={48} aria-hidden="true" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{error}</p>
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <FiRefreshCw className={`${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              Try Again
            </motion.button>
          </div>
        ) : profile ? (
          <ProfileInfo profile={profile} reloadProfile={handleRefresh} isRefreshing={isRefreshing} />
        ) : null}
      </div>
    </>
  );
};

export default Profile;
