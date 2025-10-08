import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { FaUser, FaBriefcase, FaChartLine } from 'react-icons/fa';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo - Left Side */}
        <Link to="/" className="nav-logo">
          <div className="logo-container">
            <span className="logo-icon">💼</span>
            <h2>EarnSure</h2>
          </div>
        </Link>

        {/* Main Navigation - Center */}
        <ul className="nav-menu">
          <li><Link to="/">{t('nav.home')}</Link></li>
          <li><Link to="/jobs">{t('nav.jobs')}</Link></li>
          <li><Link to="/wages">{t('nav.wages')}</Link></li>
          <li><Link to="/about">{t('nav.about')}</Link></li>
          <li><Link to="/contact">{t('nav.contact')}</Link></li>
        </ul>

        {/* User Actions - Right Side */}
        <div className="nav-actions">
          <LanguageSwitcher />

          {user ? (
            <div className="user-menu">
              {/* Post Job Button (Only for Employers) */}
              {user.role === 'employer' && (
                <Link to="/post-job" className="btn-post-job">
                  <FaBriefcase /> {t('nav.postJob')}
                </Link>
              )}

              {/* User Dropdown */}
              <div className="user-dropdown">
                <button className="user-button">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <span className="user-name">{user.name}</span>
                </button>
                
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <span className="dropdown-role">{user.role}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/dashboard" className="dropdown-item">
                    <FaChartLine /> {t('nav.dashboard')}
                  </Link>
                  <Link to="/profile" className="dropdown-item">
                    <FaUser /> {t('nav.profile')}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={logout} className="dropdown-item logout-item">
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-register">
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
