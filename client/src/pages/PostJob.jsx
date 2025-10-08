import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { createJob } from '../services/api';
import { FaBriefcase } from 'react-icons/fa';

const PostJob = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'construction',
    wage: {
      amount: '',
      type: 'daily'
    },
    duration: '',
    workersNeeded: 1,
    location: {
      city: '',
      state: '',
      address: ''
    },
    requirements: '',
    startDate: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'employer') {
      toast.error('Only employers can post jobs');
      return;
    }

    if (!formData.title || !formData.description || !formData.wage.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req)
      };

      await createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Post job error:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>Only employers can post jobs</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="post-job-container">
      <div className="post-job-header">
        <FaBriefcase className="page-icon" />
        <h1>Post a New Job</h1>
        <p>Fill in the details to hire daily wage workers</p>
      </div>

      <form onSubmit={handleSubmit} className="post-job-form">
        <div className="form-section">
          <h3>Job Details</h3>
          
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Construction Workers Needed"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities and expectations..."
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="construction">Construction</option>
                <option value="agriculture">Agriculture</option>
                <option value="domestic">Domestic Help</option>
                <option value="delivery">Delivery</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 2 weeks, 1 month"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Wage Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Wage Amount (₹) *</label>
              <input
                type="number"
                name="wage.amount"
                value={formData.wage.amount}
                onChange={handleChange}
                placeholder="500"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Wage Type *</label>
              <select
                name="wage.type"
                value={formData.wage.type}
                onChange={handleChange}
                required
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="fixed">Fixed Project</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location</h3>
          
          <div className="form-group">
            <label>Full Address *</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Street, Landmark"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="Vijayawada"
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="Andhra Pradesh"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Workers Needed *</label>
              <input
                type="number"
                name="workersNeeded"
                value={formData.workersNeeded}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Requirements (comma separated)</label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g., Physical fitness, Experience in construction"
            />
            <small>Separate each requirement with a comma</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
