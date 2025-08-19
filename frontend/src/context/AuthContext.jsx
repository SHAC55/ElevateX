// // src/context/AuthContext.js
// import { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const res = await axios.post('http://localhost:5000/api/auth/login', {
//       email,
//       password,
//     });

//     const { token: newToken, user: userData } = res.data;

//     setToken(newToken);
//     setUser(userData);
//     localStorage.setItem('token', newToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     // Optional: Redirect or toast here
//     // navigate('/login');
//     // toast.info('You have been logged out');
//   };

//   return (
 
//   <AuthContext.Provider value={{ user, token, login, logout, loading, setToken, setUser }}>
//     {children}
//   </AuthContext.Provider>
// );

  
// };

// export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserRaw = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUserRaw && savedUserRaw !== 'undefined') {
      try {
        const parsedUser = JSON.parse(savedUserRaw);
        setUser(parsedUser);
      } catch (err) {
        console.error('Invalid user data in localStorage, clearing it:', err);
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    const { token: newToken, user: userData } = res.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setToken, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
