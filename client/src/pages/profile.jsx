import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaUser, FaEdit, FaSave, FaTimes, FaStar } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      city: '',
      state: '',
      pincode: ''
    },
    skills: [],
    experience: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        location: data.location || { city: '', state: '', pincode: '' },
        skills: data.skills || [],
        experience: data.experience || 0
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

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
    } else if (name === 'skills') {
      setFormData({ ...formData, skills: value.split(',').map(s => s.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header-section">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h1>{formData.name}</h1>
            <p className="role-tag">{user?.role}</p>
            <div className="profile-stats">
              <div className="stat">
                <FaStar className="star" />
                <span>{user?.rating || 0}/5</span>
              </div>
              <div className="stat">
                <span className="label">Jobs:</span>
                <span className="value">{user?.completedJobs || 0}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'btn-cancel' : 'btn-edit'}
          >
            {isEditing ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit Profile</>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label>Email (Cannot be changed)</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location?.city || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location?.state || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter state"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="location.pincode"
                  value={formData.location?.pincode || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          {user?.role === 'worker' && (
            <div className="form-section">
              <h3>Professional Details</h3>
              
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills?.join(', ') || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., Construction, Painting, Welding"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="0"
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
