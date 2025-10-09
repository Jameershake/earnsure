import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import { loginUser } from '../services/api';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const { t } = useTranslation();
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('auth.emailRequired') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid') || 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordTooShort') || 'Password must be at least 6 characters';
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
      return;
    }

    setLoading(true);

    try {
      const { data } = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      // Call login from AuthContext
      await login(data, data.token, formData.rememberMe);

      // Get redirect path from location state (for protected routes)
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error(t('auth.invalidCredentials') || 'Invalid email or password');
      } else if (error.response?.status === 429) {
        toast.error(t('auth.tooManyAttempts') || 'Too many login attempts. Please try again later.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error(t('errors.networkError') || 'Network error. Please check your connection.');
      } else {
        toast.error(error.response?.data?.message || t('auth.loginFailed') || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">{t('auth.loginTitle')}</h1>
          <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Input */}
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
                aria-label={t('auth.email')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Input */}
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
                autoComplete="current-password"
                aria-label={t('auth.password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                disabled={loading}
              />
              <span>{t('auth.rememberMe')}</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              {t('auth.forgotPassword')}
            </Link>
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
                {t('auth.loggingIn')}
              </>
            ) : (
              t('auth.loginButton')
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>{t('common.or') || 'or'}</span>
        </div>

        {/* Sign Up Link */}
        <p className="auth-link">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="link-primary">
            {t('auth.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
