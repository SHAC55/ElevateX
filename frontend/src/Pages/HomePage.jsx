import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // force refresh or use navigate('/login')
  };

  if (!user) return null;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.username}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Signed in via:</strong> {user.provider || 'Email/Password'}</p>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
