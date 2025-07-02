import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OauthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const provider = queryParams.get('provider'); // ✅ Get provider

    if (!token) {
      navigate('/login');
      return;
    }

    // Save token
    localStorage.setItem('token', token);
    setToken(token);

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.error("Failed to decode JWT", err);
    }

    // Fetch user info using token
    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const enrichedUser = { ...data.user, provider }; // ✅ Add provider
          localStorage.setItem('user', JSON.stringify(enrichedUser));
          setUser(enrichedUser);
          navigate('/home');
        } else {
          navigate('/login?error=UserFetchFailed');
        }
      })
      .catch(() => {
        navigate('/login?error=UserFetchFailed');
      });
  }, [location, setToken, setUser, navigate]);

  return <div className="p-4 text-center">Redirecting...</div>;
};

export default OauthSuccess;
