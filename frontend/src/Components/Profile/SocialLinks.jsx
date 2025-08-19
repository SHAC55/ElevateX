import React from "react";
import { motion } from "framer-motion";

// Importing icons from assets
import GitHubIcon from "../../assets/github.png";
import LinkedInIcon from "../../assets/linkedin.png";
import LeetCodeIcon from "../../assets/leetcode.png";
import CodeforcesIcon from "../../assets/cf.png";
import DiscordIcon from "../../assets/discord.png";

const platformIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  leetcode: LeetCodeIcon,
  codeforces: CodeforcesIcon,
  discord: DiscordIcon
};

const brandColors = {
  github: "#333",
  linkedin: "#0077B5",
  leetcode: "#FFA116",
  codeforces: "#1F8ACB",
  discord: "#7289DA",
};

const SocialLinks = ({ links }) => {
  if (!links?.length) {
    return (
      <p className="text-gray-500 italic dark:text-gray-400">
        No social links added yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {links.map((link, idx) => {
        const platformKey = link.platform.toLowerCase();
        const iconSrc = platformIcons[platformKey];
        const color = brandColors[platformKey] || "inherit";

        return (
          <motion.a
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ 
              y: -3, 
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", 
              backgroundColor: `${color}10`,
              borderColor: color
            }}
            whileTap={{ scale: 0.98 }}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center space-x-3 bg-white text-gray-800 px-5 py-3 rounded-xl shadow-sm border border-gray-200 transition-all dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
            style={{ borderColor: color }}
          >
            {iconSrc ? (
              <img 
                src={iconSrc} 
                alt={link.platform} 
                className="w-6 h-6" 
              />
            ) : (
              <span>🔗</span>
            )}
            <span className="font-medium">{link.platform}</span>
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialLinks;