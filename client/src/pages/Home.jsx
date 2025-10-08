import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaCheckCircle, FaBriefcase, FaChartLine, FaLanguage, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          {user ? (
            <>
              <h1>Welcome back, {user.name}! 🎉</h1>
              <p>Continue your journey with EarnSure</p>
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-primary"
                >
                  <FaUser /> Go to Dashboard
                </button>
                <button 
                  onClick={() => navigate(user.role === 'employer' ? '/post-job' : '/jobs')} 
                  className="btn-secondary"
                >
                  <FaBriefcase /> {user.role === 'employer' ? 'Post Job' : 'Find Jobs'}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>{t('home.title')}</h1>
              <p>{t('home.subtitle')}</p>
              <Link to="/register" className="btn-primary">
                {t('home.getStarted')}
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <h2>{t('home.features.title')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>{t('home.features.fairWages')}</h3>
            <p>{t('home.features.fairWagesDesc')}</p>
          </div>

          <div className="feature-card">
            <FaBriefcase className="feature-icon" />
            <h3>{t('home.features.verifiedJobs')}</h3>
            <p>{t('home.features.verifiedJobsDesc')}</p>
          </div>

          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>{t('home.features.financial')}</h3>
            <p>{t('home.features.financialDesc')}</p>
          </div>

          <div className="feature-card">
            <FaLanguage className="feature-icon" />
            <h3>{t('home.features.multilingual')}</h3>
            <p>{t('home.features.multilingualDesc')}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions for Logged-in Users */}
      {user && (
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/jobs" className="action-card">
              <FaBriefcase className="action-icon" />
              <h3>Browse Jobs</h3>
              <p>Find the perfect opportunity</p>
            </Link>

            {user.role === 'employer' && (
              <Link to="/post-job" className="action-card">
                <FaCheckCircle className="action-icon" />
                <h3>Post a Job</h3>
                <p>Find skilled workers</p>
              </Link>
            )}

            <Link to="/wages" className="action-card">
              <FaChartLine className="action-icon" />
              <h3>Wage Benchmarks</h3>
              <p>Check fair wages</p>
            </Link>

            <Link to="/dashboard" className="action-card">
              <FaUser className="action-icon" />
              <h3>My Profile</h3>
              <p>Manage your account</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
