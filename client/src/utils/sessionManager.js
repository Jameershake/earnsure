import Cookies from 'js-cookie';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before expiry
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export const sessionManager = {
  // Set session with expiry
  setSession: (token, rememberMe = false) => {
    const expiryTime = Date.now() + SESSION_TIMEOUT;
    
    if (rememberMe) {
      // Remember for 7 days
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('sessionExpiry', expiryTime, { expires: 7 });
    } else {
      // Session expires in 30 minutes
      Cookies.set('token', token, { expires: 1/48 }); // 30 minutes
      Cookies.set('sessionExpiry', expiryTime, { expires: 1/48 });
    }
    
    localStorage.setItem('lastActivity', Date.now().toString());
  },

  // Get session token
  getToken: () => {
    return Cookies.get('token');
  },

  // Get session expiry time
  getSessionExpiry: () => {
    return parseInt(Cookies.get('sessionExpiry') || '0');
  },

  // Check if session is valid
  isSessionValid: () => {
    const token = sessionManager.getToken();
    const expiry = sessionManager.getSessionExpiry();
    
    if (!token || !expiry) return false;
    
    return Date.now() < expiry;
  },

  // Update session activity
  updateActivity: () => {
    const token = sessionManager.getToken();
    if (!token) return;

    const newExpiry = Date.now() + SESSION_TIMEOUT;
    Cookies.set('sessionExpiry', newExpiry, { expires: 1/48 });
    localStorage.setItem('lastActivity', Date.now().toString());
  },

  // Clear session
  clearSession: () => {
    Cookies.remove('token');
    Cookies.remove('sessionExpiry');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('user');
  },

  // Get time until session expires
  getTimeUntilExpiry: () => {
    const expiry = sessionManager.getSessionExpiry();
    if (!expiry) return 0;
    return Math.max(0, expiry - Date.now());
  },

  // Check if warning should be shown
  shouldShowWarning: () => {
    const timeLeft = sessionManager.getTimeUntilExpiry();
    return timeLeft > 0 && timeLeft <= WARNING_TIME;
  }
};

// Activity detector
export const setupActivityDetector = (updateCallback) => {
  const handleActivity = () => {
    sessionManager.updateActivity();
    if (updateCallback) updateCallback();
  };

  ACTIVITY_EVENTS.forEach(event => {
    window.addEventListener(event, handleActivity, { passive: true });
  });

  // Cleanup function
  return () => {
    ACTIVITY_EVENTS.forEach(event => {
      window.removeEventListener(event, handleActivity);
    });
  };
};
