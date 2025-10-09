import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <h3>💼 EarnSure</h3>
          <p>{t('footer.description')}</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li><Link to="/">{t('footer.home')}</Link></li>
            <li><Link to="/about">{t('footer.aboutUs')}</Link></li>
            <li><Link to="/jobs">{t('footer.findJobs')}</Link></li>
            <li><Link to="/wages">{t('footer.wages')}</Link></li>
            <li><Link to="/contact">{t('footer.contact')}</Link></li>
          </ul>
        </div>

        {/* For Workers */}
        <div className="footer-section">
          <h4>{t('footer.forWorkers')}</h4>
          <ul>
            <li><Link to="/register">{t('nav.register')}</Link></li>
            <li><Link to="/jobs">{t('footer.browseJobs')}</Link></li>
            <li><Link to="/dashboard">{t('nav.dashboard')}</Link></li>
            <li><Link to="/profile">{t('nav.profile')}</Link></li>
          </ul>
        </div>

        {/* For Employers */}
        <div className="footer-section">
          <h4>{t('footer.forEmployers')}</h4>
          <ul>
            <li><Link to="/register">{t('nav.register')}</Link></li>
            <li><Link to="/post-job">{t('footer.postJobs')}</Link></li>
            <li><Link to="/dashboard">{t('nav.dashboard')}</Link></li>
            <li><Link to="/profile">{t('nav.profile')}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>{t('contact.contactInfo')}</h4>
          <ul className="contact-info-list">
            <li>
              <FaEnvelope className="contact-icon-footer" />
              <div>
                <span>support@earnsure.com</span>
                <span>info@earnsure.com</span>
              </div>
            </li>
            <li>
              <FaPhone className="contact-icon-footer" />
              <div>
                <span>+91 8897198489</span>
                <span>Available Mon-Sat, 9 AM - 6 PM</span>
              </div>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon-footer" />
              <div>
                <span>Seshadri Rao Knowledge Village</span>
                <span>Gudlavalleru - 521356</span>
                <span>Krishna District, Andhra Pradesh</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 EarnSure. {t('footer.copyright')}</p>
          <div className="footer-legal-links">
            <Link to="/privacy">{t('footer.privacyPolicy')}</Link>
            <span className="separator">•</span>
            <Link to="/terms">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
