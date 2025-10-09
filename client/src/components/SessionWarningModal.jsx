import { useState, useEffect } from 'react';
import { FaClock, FaSignOutAlt, FaRedo } from 'react-icons/fa';

const SessionWarningModal = ({ timeLeft, onExtend, onLogout }) => {
  const [countdown, setCountdown] = useState(Math.floor(timeLeft / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown = Math.floor(timeLeft / 1000);
      setCountdown(newCountdown);

      if (newCountdown <= 0) {
        clearInterval(interval);
        onLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onLogout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="session-modal-overlay">
      <div className="session-modal">
        <div className="session-modal-header">
          <FaClock className="warning-icon" />
          <h2>Session Expiring Soon</h2>
        </div>
        
        <div className="session-modal-body">
          <p>Your session will expire in:</p>
          <div className="countdown-timer">
            {formatTime(countdown)}
          </div>
          <p>Would you like to continue your session?</p>
        </div>

        <div className="session-modal-actions">
          <button onClick={onExtend} className="btn-primary">
            <FaRedo /> Continue Session
          </button>
          <button onClick={onLogout} className="btn-secondary">
            <FaSignOutAlt /> Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;
