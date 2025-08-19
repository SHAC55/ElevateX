import React, { createContext, useContext, useState, useCallback } from 'react';

const CustomToastContext = createContext();

export const useCustomToast = () => useContext(CustomToastContext);

export const CustomToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message, duration = 2000) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, duration);
  }, []);

  return (
    <CustomToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg shadow-lg z-50 transition-all duration-300"
          style={{ opacity: toast.visible ? 1 : 0 }}
        >
          {toast.message}
        </div>
      )}
    </CustomToastContext.Provider>
  );
};
