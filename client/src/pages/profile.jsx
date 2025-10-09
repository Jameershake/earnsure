import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';
import { FaUser, FaEdit, FaSave, FaTimes, FaStar } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ All values initialized with empty strings (never undefined)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      const { data } = await getProfile();
      
      // ✅ All values have fallbacks
      setFormData({
        name: data.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        location: {
          city: data.location?.city || '',
          state: data.location?.state || '',
          pincode: data.location?.pincode || ''
        },
        skills: data.skills || [],
        experience: data.experience || 0
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load profile');
      }
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
      await updateProfile(formData);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
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
            <h1>{formData.name || 'User'}</h1>
            <p className="role-tag">{user?.role || 'worker'}</p>
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
                value={formData.email || user?.email || ''}
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
                  value={formData.location.city}
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
                  value={formData.location.state}
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
                  value={formData.location.pincode}
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
                  value={formData.skills.join(', ')}
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
