import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sessionManager, setupActivityDetector } from '../utils/sessionManager';
import SessionWarningModal from '../components/SessionWarningModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionManager.getToken();
    const savedUser = localStorage.getItem('user');

    if (token && savedUser && savedUser !== 'undefined' && sessionManager.isSessionValid()) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else if (token) {
      handleSessionExpiry();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    const cleanup = setupActivityDetector(() => {
      if (showWarning && sessionManager.getTimeUntilExpiry() > 5 * 60 * 1000) {
        setShowWarning(false);
      }
    });

    return cleanup;
  }, [user, showWarning]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (!sessionManager.isSessionValid()) {
        handleSessionExpiry();
      } else if (sessionManager.shouldShowWarning()) {
        setShowWarning(true);
        setTimeLeft(sessionManager.getTimeUntilExpiry());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleSessionExpiry = () => {
    sessionManager.clearSession();
    setUser(null);
    setShowWarning(false);
    toast.warning('Your session has expired. Please login again.');
    navigate('/login');
  };

  const login = async (userData, token, rememberMe = false) => {
    try {
      console.log('Login function called with:', { userData, token, rememberMe });

      sessionManager.setSession(token, rememberMe);
      
      const userToSave = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone
      };

      localStorage.setItem('user', JSON.stringify(userToSave));
      localStorage.setItem('token', token);
      
      setUser(userToSave);
      
      console.log('User logged in successfully:', userToSave);
      
      toast.success('Login successful!');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    sessionManager.clearSession();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowWarning(false);
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const extendSession = () => {
    sessionManager.updateActivity();
    setShowWarning(false);
    toast.success('Session extended successfully');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
      {showWarning && (
        <SessionWarningModal
          timeLeft={timeLeft}
          onExtend={extendSession}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
  );
};

// Export both named and default for compatibility
export { AuthContext as default };
