import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaCheckCircle, FaBriefcase, FaChartLine, FaLanguage, FaUser } from 'react-icons/fa';

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
              <h1>{t('home.welcomeBack')}, {user.name}! 🎉</h1>
              <p>{t('home.continueJourney')}</p>
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-primary"
                >
                  <FaUser /> {t('home.goToDashboard')}
                </button>
                <button 
                  onClick={() => navigate(user.role === 'employer' ? '/post-job' : '/jobs')} 
                  className="btn-secondary"
                >
                  <FaBriefcase /> {user.role === 'employer' ? t('home.postJob') : t('home.findJobs')}
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

      {user && (
        <section className="quick-actions">
          <h2>{t('home.quickActions')}</h2>
          <div className="actions-grid">
            <Link to="/jobs" className="action-card">
              <FaBriefcase className="action-icon" />
              <h3>{t('home.browseJobs')}</h3>
              <p>{t('home.perfectOpportunity')}</p>
            </Link>

            {user.role === 'employer' && (
              <Link to="/post-job" className="action-card">
                <FaCheckCircle className="action-icon" />
                <h3>{t('home.postJob')}</h3>
                <p>{t('home.findWorkers')}</p>
              </Link>
            )}

            <Link to="/wages" className="action-card">
              <FaChartLine className="action-icon" />
              <h3>{t('home.wageBenchmarks')}</h3>
              <p>{t('home.checkWages')}</p>
            </Link>

            <Link to="/dashboard" className="action-card">
              <FaUser className="action-icon" />
              <h3>{t('home.myProfile')}</h3>
              <p>{t('home.manageAccount')}</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
