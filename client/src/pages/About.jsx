import { FaBullseye, FaEye, FaHeart, FaUsers } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About EarnSure</h1>
          <p>Empowering Daily Wage Workers Through Technology</p>
        </div>
      </section>

      <div className="about-container">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            EarnSure was born from a simple observation: millions of daily wage workers in India
            face challenges in finding fair employment, securing reasonable wages, and accessing
            financial services. We saw an opportunity to bridge this gap using technology.
          </p>
          <p>
            Our platform connects verified employers with skilled workers, ensuring transparency
            in wages, secure transactions, and equal opportunities for all. We believe that every
            worker deserves fair compensation, respect, and financial security.
          </p>
        </section>

        <section className="mission-vision">
          <div className="mv-card">
            <FaBullseye className="mv-icon" />
            <h3>Our Mission</h3>
            <p>
              To create a transparent, accessible platform that empowers daily wage workers
              with fair job opportunities, wage transparency, and financial inclusion tools.
            </p>
          </div>

          <div className="mv-card">
            <FaEye className="mv-icon" />
            <h3>Our Vision</h3>
            <p>
              A future where every daily wage worker has access to dignified employment,
              fair wages, and financial security through technology-enabled solutions.
            </p>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <FaHeart className="value-icon" />
              <h4>Empathy</h4>
              <p>Understanding the challenges faced by daily wage workers</p>
            </div>
            <div className="value-card">
              <FaUsers className="value-icon" />
              <h4>Inclusivity</h4>
              <p>Creating opportunities for all, regardless of background</p>
            </div>
            <div className="value-card">
              <FaBullseye className="value-icon" />
              <h4>Transparency</h4>
              <p>Clear wage benchmarks and honest job descriptions</p>
            </div>
            <div className="value-card">
              <FaEye className="value-icon" />
              <h4>Integrity</h4>
              <p>Building trust through verified profiles and secure transactions</p>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <h2>Our Impact</h2>
          <div className="impact-stats">
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Workers Connected</p>
            </div>
            <div className="stat-card">
              <h3>500+</h3>
              <p>Jobs Posted</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Cities Covered</p>
            </div>
            <div className="stat-card">
              <h3>₹10L+</h3>
              <p>Fair Wages Ensured</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>What We Offer</h2>
          <div className="features-list">
            <div className="feature-item">
              <h4>🎯 Fair Wage Transparency</h4>
              <p>Access local wage benchmarks to ensure fair compensation for your work</p>
            </div>
            <div className="feature-item">
              <h4>✅ Verified Opportunities</h4>
              <p>Connect with verified employers for secure and legitimate employment</p>
            </div>
            <div className="feature-item">
              <h4>💰 Financial Inclusion</h4>
              <p>Access to financial literacy resources and information about financial services</p>
            </div>
            <div className="feature-item">
              <h4>🌐 Multilingual Support</h4>
              <p>Use the platform in your preferred language - English, Hindi, or Telugu</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Join Us Today</h2>
          <p>Whether you're looking for work or hiring workers, EarnSure is here to help</p>
          <div className="cta-buttons">
            <a href="/register" className="btn-primary">Get Started</a>
            <a href="/jobs" className="btn-secondary">Browse Jobs</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
