import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserTie, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Register = () => {
  const { t } = useTranslation();
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'worker'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration...', formData);

      const { data } = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      });

      console.log('Registration successful:', data);

      // Log the user in automatically after registration
      await login(data, data.token, false);

      toast.success('Registration successful! Welcome to EarnSure!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Registration error:', error);

      // Handle specific error cases
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        toast.error('An account with this email already exists');
        setErrors({ email: 'Email already registered' });
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">{t('auth.registerTitle')}</h1>
          <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              {t('auth.name')}
            </label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder={t('auth.namePlaceholder')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={loading}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('auth.email')}
            </label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('auth.password')}
            </label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {t('auth.confirmPassword')}
            </label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              {t('auth.phone')}
            </label>
            <div className="input-wrapper">
              <FaPhone className="input-icon" />
              <input
                id="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                placeholder={t('auth.phonePlaceholder')}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                autoComplete="tel"
                maxLength="10"
              />
            </div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              {t('auth.role')}
            </label>
            <div className="input-wrapper">
              <FaUserTie className="input-icon" />
              <select
                id="role"
                className={`form-input ${errors.role ? 'input-error' : ''}`}
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                disabled={loading}
              >
                <option value="worker">{t('auth.worker')}</option>
                <option value="employer">{t('auth.employer')}</option>
              </select>
            </div>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                {t('auth.registering')}
              </>
            ) : (
              t('auth.registerButton')
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>{t('common.or') || 'or'}</span>
        </div>

        {/* Login Link */}
        <p className="auth-link">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="link-primary">
            {t('auth.loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
