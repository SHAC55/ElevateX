// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaExclamationTriangle } from 'react-icons/fa';

// const ResetCareer = ({ onReset }) => {
//   const [showModal, setShowModal] = useState(false);

//   const handleConfirm = () => {
//     onReset();
//     setShowModal(false);
//   };

//   return (
//     <>
//       {/* Reset Button */}
//       <button
//         onClick={() => setShowModal(true)}
//         className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//       >
//         Reset
//       </button>

//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl text-center relative animate-fade-in"
//               initial={{ scale: 0.9, y: 30 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 30 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="flex flex-col items-center">
//                 <FaExclamationTriangle className="text-red-600 text-4xl mb-3" />
//                 <h2 className="text-xl font-semibold mb-2 text-gray-800">
//                   Reset Career Path?
//                 </h2>
//                 <p className="text-gray-600 mb-5">
//                   This will remove your current selection. Are you sure you want to continue?
//                 </p>
//                 <div className="flex justify-center gap-4">
//                   <button
//                     onClick={handleConfirm}
//                     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                   >
//                     Yes, Reset
//                   </button>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default ResetCareer;

// src/Components/ResetCareer.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import GlassyButton from './ui/GlassyButton';

const ResetCareer = ({ onReset }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    onReset();
    setShowModal(false);
  };

  return (
    <>
      {/* Trigger */}
      <GlassyButton
        variant="danger"
        onClick={() => setShowModal(true)}
        className="shadow-xl"
      >
        Reset
      </GlassyButton>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dim */}
            <div className="absolute inset-0 bg-black/50" />
            {/* Card */}
            <motion.div
              className="relative w-[90%] max-w-md rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-2xl p-6 text-center"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center">
                <FaExclamationTriangle className="text-rose-600 text-4xl mb-3" />
                <h2 className="text-xl font-semibold mb-2 text-slate-900">
                  Reset Career Path?
                </h2>
                <p className="text-slate-600 mb-5">
                  This will remove your current selection. Are you sure you want to continue?
                </p>
                <div className="flex justify-center gap-3">
                  <GlassyButton variant="danger" onClick={handleConfirm}>
                    Yes, Reset
                  </GlassyButton>
                  <GlassyButton variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </GlassyButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResetCareer;
