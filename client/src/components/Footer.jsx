import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <h3>💼 EarnSure</h3>
          <p>Empowering daily wage workers through fair employment opportunities and wage transparency.</p>
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
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/jobs">Find Jobs</Link></li>
            <li><Link to="/wages">Wage Benchmarks</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* For Workers */}
        <div className="footer-section">
          <h4>For Workers</h4>
          <ul>
            <li><Link to="/register">Register as Worker</Link></li>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/dashboard">My Dashboard</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>

        {/* For Employers */}
        <div className="footer-section">
          <h4>For Employers</h4>
          <ul>
            <li><Link to="/register">Register as Employer</Link></li>
            <li><Link to="/post-job">Post a Job</Link></li>
            <li><Link to="/dashboard">Manage Applications</Link></li>
            <li><Link to="/profile">Company Profile</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
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
                <span>+91 1800-123-4567</span>
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
          <p>&copy; 2025 EarnSure. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
