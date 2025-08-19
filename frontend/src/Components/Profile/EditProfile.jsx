// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { updateProfile, uploadProfilePicture, deleteProfilePicture } from "../../api/profile";
// import toast from "react-hot-toast";

// import GitHubIcon from "../../assets/github.png";
// import LinkedInIcon from "../../assets/linkedin.png";
// import LeetCodeIcon from "../../assets/leetcode.png";
// import CodeforcesIcon from "../../assets/cf.png";
// import DiscordIcon from "../../assets/discord.png";

// const SOCIAL_OPTIONS = [
//   { label: "GitHub", value: "GitHub", icon: GitHubIcon },
//   { label: "LinkedIn", value: "LinkedIn", icon: LinkedInIcon },
//   { label: "LeetCode", value: "LeetCode", icon: LeetCodeIcon },
//   { label: "Codeforces", value: "Codeforces", icon: CodeforcesIcon },
//   { label: "Discord", value: "Discord", icon: DiscordIcon },
// ];

// const PlatformDropdown = ({ value, onChange }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const handleClickOutside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const selectedOption = SOCIAL_OPTIONS.find((o) => o.value === value);

//   return (
//     <div ref={ref} className="relative w-48">
//       <motion.button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-white dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//         whileHover={{ y: -2 }}
//         whileTap={{ scale: 0.98 }}
//       >
//         {selectedOption ? (
//           <div className="flex items-center">
//             <img src={selectedOption.icon} alt="" className="w-6 h-6 mr-3" aria-hidden="true" />
//             <span className="font-medium">{selectedOption.label}</span>
//           </div>
//         ) : (
//           <span className="text-gray-400">Select platform</span>
//         )}
//         <motion.span
//           animate={{ rotate: open ? 180 : 0 }}
//           className="w-5 h-5 ml-2 text-blue-500"
//           aria-hidden="true"
//         >
//           ▼
//         </motion.span>
//       </motion.button>

//       <AnimatePresence>
//         {open && (
//           <motion.ul
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-auto"
//             role="listbox"
//           >
//             {SOCIAL_OPTIONS.map(({ label, value: val, icon }) => (
//               <motion.li
//                 key={val}
//                 whileHover={{ scale: 1.02, backgroundColor: "#f0f7ff" }}
//                 onClick={() => {
//                   onChange(val);
//                   setOpen(false);
//                 }}
//                 className="cursor-pointer px-4 py-3 flex items-center"
//                 role="option"
//                 aria-selected={val === value}
//               >
//                 <img src={icon} alt="" className="w-6 h-6 mr-3" aria-hidden="true" />
//                 <span className="font-medium">{label}</span>
//               </motion.li>
//             ))}
//           </motion.ul>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const EditProfile = ({ initialUsername, initialLinks, onCancel, onSave }) => {
//   const [form, setForm] = useState({
//     username: initialUsername || "",
//     links: initialLinks || [],
//   });
//   const [preview, setPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const [picModalOpen, setPicModalOpen] = useState(false);

//   const handleAddLink = () => {
//     setForm((f) => ({
//       ...f,
//       links: [...(f.links || []), { platform: "", url: "" }],
//     }));
//   };

//   const handleRemoveLink = (idx) => {
//     setForm((f) => ({
//       ...f,
//       links: f.links.filter((_, i) => i !== idx),
//     }));
//   };

//   const handleLinkChange = (idx, key, value) => {
//     setForm((f) => {
//       const updated = [...(f.links || [])];
//       updated[idx] = { ...updated[idx], [key]: value };
//       return { ...f, links: updated };
//     });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setPreview(URL.createObjectURL(file));

//     const fd = new FormData();
//     fd.append("profilePicture", file);
//     uploadProfilePicture(fd).catch((err) => {
//       toast.error("Failed to upload image");
//       console.error("Upload failed", err);
//     });
//   };

//   const openPicModal = () => setPicModalOpen(true);
//   const closePicModal = () => setPicModalOpen(false);

//   const chooseFromGallery = () => {
//     closePicModal();
//     fileInputRef.current?.click();
//   };

//   const deletePicture = async () => {
//     closePicModal();
//     try {
//       await deleteProfilePicture();
//       setPreview(null);
//       toast.success("Profile picture removed");
//     } catch (err) {
//       toast.error("Failed to delete picture");
//       console.error("Delete failed", err);
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       await updateProfile({
//         username: form.username,
//         links: form.links,
//       });
//       onSave(form);
//       toast.success("Profile saved!");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to save profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="relative max-w-2xl mx-auto p-1 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 shadow-xl"
//     >
//       {/* Animated gradient border */}
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 animate-gradient-xy blur-sm" />
      
//       <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-lg">
//         <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//           Edit Your Profile
//         </h3>

//         {/* Username Section */}
//         <div className="space-y-3 mb-8">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-1 h-6 rounded-full mr-3" />
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Username
//             </label>
//           </div>
          
//           <motion.div whileHover={{ y: -2 }} className="relative">
//             <input
//               id="username"
//               type="text"
//               value={form.username}
//               onChange={(e) => setForm({ ...form, username: e.target.value })}
//               className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pl-12 shadow-sm"
//               placeholder="e.g. alice123"
//             />
//             <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//           </motion.div>
//         </div>

//         {/* Social Links Section */}
//         <div className="space-y-6 mb-8">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-1 h-6 rounded-full mr-3" />
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Social Links</h4>
//           </div>
          
//           <div className="space-y-4">
//             {form.links.map((link, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-white dark:border-gray-700 shadow-sm"
//               >
//                 <PlatformDropdown
//                   value={link.platform}
//                   onChange={(val) => handleLinkChange(idx, "platform", val)}
//                 />
//                 <div className="flex-1 w-full">
//                   <input
//                     type="url"
//                     placeholder="https://"
//                     value={link.url}
//                     onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
//                     className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>
//                 <motion.button
//                   onClick={() => handleRemoveLink(idx)}
//                   className="p-2 text-red-500 hover:text-red-700 transition"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   aria-label="Remove link"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </motion.button>
//               </motion.div>
//             ))}
//           </div>
          
//           <motion.button
//             onClick={handleAddLink}
//             className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             <span className="font-medium">Add Link</span>
//           </motion.button>
//         </div>

//         {/* Hidden file input */}
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//           accept="image/*"
//         />

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//           <motion.button
//             onClick={openPicModal}
//             className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
//             whileHover={{ y: -2 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span>Change Picture</span>
//           </motion.button>
          
//           <div className="flex gap-4">
//             <motion.button
//               onClick={onCancel}
//               className="px-5 py-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow hover:shadow-md transition-all flex-1"
//               whileHover={{ y: -2 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Cancel
//             </motion.button>
//             <motion.button
//               onClick={handleSave}
//               disabled={isLoading}
//               className="px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex-1 flex items-center justify-center gap-2"
//               whileHover={{ scale: isLoading ? 1 : 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Saving...</span>
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   <span>Save Changes</span>
//                 </>
//               )}
//             </motion.button>
//           </div>
//         </div>
//       </div>

//       {/* Premium Picture Modal */}
//       <AnimatePresence>
//         {picModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
//             onClick={closePicModal}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.9, y: 20, opacity: 0 }}
//               className="bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-2xl max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal gradient border */}
//               <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 animate-gradient-xy blur-sm" />
              
//               <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 z-10">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//                     Profile Picture
//                   </h3>
//                   <motion.button
//                     onClick={closePicModal}
//                     className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                     whileHover={{ scale: 1.1, rotate: 90 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </motion.button>
//                 </div>
                
//                 <div className="space-y-4">
//                   <motion.button
//                     onClick={chooseFromGallery}
//                     className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
//                     whileHover={{ y: -3 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                     </svg>
//                     <span className="font-medium">Upload Photo</span>
//                   </motion.button>
                  
//                   <motion.button
//                     onClick={deletePicture}
//                     className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
//                     whileHover={{ y: -3 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     <span className="font-medium">Remove Photo</span>
//                   </motion.button>
                  
//                   <motion.button
//                     onClick={closePicModal}
//                     className="w-full py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow hover:shadow-md transition-all"
//                     whileHover={{ y: -3 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     Cancel
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default EditProfile;


import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile, uploadProfilePicture, deleteProfilePicture } from "../../api/profile";
import toast from "react-hot-toast";

import GitHubIcon from "../../assets/github.png";
import LinkedInIcon from "../../assets/linkedin.png";
import LeetCodeIcon from "../../assets/leetcode.png";
import CodeforcesIcon from "../../assets/cf.png";
import DiscordIcon from "../../assets/discord.png";

const SOCIAL_OPTIONS = [
  { label: "GitHub", value: "GitHub", icon: GitHubIcon },
  { label: "LinkedIn", value: "LinkedIn", icon: LinkedInIcon },
  { label: "LeetCode", value: "LeetCode", icon: LeetCodeIcon },
  { label: "Codeforces", value: "Codeforces", icon: CodeforcesIcon },
  { label: "Discord", value: "Discord", icon: DiscordIcon },
];

const PlatformDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = SOCIAL_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-48">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-white dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedOption ? (
          <div className="flex items-center">
            <img src={selectedOption.icon} alt="" className="w-6 h-6 mr-3" aria-hidden="true" />
            <span className="font-medium">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select platform</span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="w-5 h-5 ml-2 text-blue-500"
          aria-hidden="true"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-auto"
            role="listbox"
          >
            {SOCIAL_OPTIONS.map(({ label, value: val, icon }) => (
              <motion.li
                key={val}
                whileHover={{ scale: 1.02, backgroundColor: "#f0f7ff" }}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                className="cursor-pointer px-4 py-3 flex items-center"
                role="option"
                aria-selected={val === value}
              >
                <img src={icon} alt="" className="w-6 h-6 mr-3" aria-hidden="true" />
                <span className="font-medium">{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const EditProfile = ({ initialUsername, initialLinks, onCancel, onSave }) => {
  const [form, setForm] = useState({
    username: initialUsername || "",
    links: initialLinks || [],
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [picModalOpen, setPicModalOpen] = useState(false);

  const handleAddLink = () => {
    setForm((f) => ({
      ...f,
      links: [...(f.links || []), { platform: "", url: "" }],
    }));
  };

  const handleRemoveLink = (idx) => {
    setForm((f) => ({
      ...f,
      links: f.links.filter((_, i) => i !== idx),
    }));
  };

  const handleLinkChange = (idx, key, value) => {
    setForm((f) => {
      const updated = [...(f.links || [])];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...f, links: updated };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("profilePicture", file);
    uploadProfilePicture(fd).catch((err) => {
      toast.error("Failed to upload image");
      console.error("Upload failed", err);
    });
  };

  const openPicModal = () => setPicModalOpen(true);
  const closePicModal = () => setPicModalOpen(false);

  const chooseFromGallery = () => {
    closePicModal();
    fileInputRef.current?.click();
  };

  const deletePicture = async () => {
    closePicModal();
    try {
      await deleteProfilePicture();
      setPreview(null);
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error("Failed to delete picture");
      console.error("Delete failed", err);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        username: form.username,
        links: form.links,
      });
      onSave(form);
      toast.success("Profile saved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative max-w-2xl mx-auto p-1 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 shadow-xl"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 animate-gradient-xy blur-sm" />
      
      {/* Scrollable Content Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-lg max-h-[80vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">
          Edit Your Profile
        </h3>

        {/* Username Section */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-1 h-6 rounded-full mr-3" />
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
          </div>
          
          <motion.div whileHover={{ y: -2 }} className="relative">
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pl-12 shadow-sm"
              placeholder="e.g. alice123"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Social Links Section */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-1 h-6 rounded-full mr-3" />
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Social Links</h4>
          </div>
          
          <div className="space-y-4">
            {form.links.map((link, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-white dark:border-gray-700 shadow-sm"
              >
                <PlatformDropdown
                  value={link.platform}
                  onChange={(val) => handleLinkChange(idx, "platform", val)}
                />
                <div className="flex-1 w-full">
                  <input
                    type="url"
                    placeholder="https://"
                    value={link.url}
                    onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <motion.button
                  onClick={() => handleRemoveLink(idx)}
                  className="p-2 text-red-500 hover:text-red-700 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Remove link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            onClick={handleAddLink}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Add Link</span>
          </motion.button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 pb-4 z-10">
          <motion.button
            onClick={openPicModal}
            className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Change Picture</span>
          </motion.button>
          
          <div className="flex gap-4">
            <motion.button
              onClick={onCancel}
              className="px-5 py-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow hover:shadow-md transition-all flex-1"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex-1 flex items-center justify-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Premium Picture Modal */}
      <AnimatePresence>
        {picModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={closePicModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 animate-gradient-xy blur-sm" />
              
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Profile Picture
                  </h3>
                  <motion.button
                    onClick={closePicModal}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <motion.button
                    onClick={chooseFromGallery}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-medium">Upload Photo</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={deletePicture}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="font-medium">Remove Photo</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={closePicModal}
                    className="w-full py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow hover:shadow-md transition-all"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditProfile;