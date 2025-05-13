
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext();

// Sample user data (in a real app, this would come from API/backend)
const sampleUsers = [
  { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, email: 'user@example.com', password: 'user123', role: 'user', name: 'Regular User' }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('apiHubUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = sampleUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Remove password before storing user
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('apiHubUser', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
      return true;
    }
    
    toast.error('Invalid email or password');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('apiHubUser');
    navigate('/login');
    toast.info('You have been logged out');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin: currentUser?.role === 'admin',
    isUser: currentUser?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
