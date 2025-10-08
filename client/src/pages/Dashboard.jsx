import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getProfile, getJobs } from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaBriefcase, FaCheckCircle, FaStar } from 'react-icons/fa';


const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const { data: profileData } = await getProfile();
      setProfile(profileData);

      if (user.role === 'employer') {
        // Fetch employer's posted jobs
        const { data: jobsData } = await getJobs();
        setJobs(jobsData.filter(job => job.employer._id === user._id));
      } else {
        // Fetch all available jobs for workers
        const { data: jobsData } = await getJobs({ status: 'open' });
        setJobs(jobsData);
      }

      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {profile?.name}! 👋</h1>
        <p className="role-badge">{user?.role === 'worker' ? 'Worker' : 'Employer'}</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <FaUser className="card-icon" />
            <h3>Profile Information</h3>
          </div>
          <div className="card-content">
            <div className="profile-item">
              <strong>Name:</strong> {profile?.name}
            </div>
            <div className="profile-item">
              <strong>Email:</strong> {profile?.email}
            </div>
            <div className="profile-item">
              <strong>Phone:</strong> {profile?.phone}
            </div>
            {profile?.location?.city && (
              <div className="profile-item">
                <strong>Location:</strong> {profile.location.city}, {profile.location.state}
              </div>
            )}
            <div className="profile-item">
              <strong>Rating:</strong> 
              <span className="rating">
                <FaStar className="star-icon" /> {profile?.rating || 0}/5
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="dashboard-card stats-card">
          <div className="card-header">
            <FaBriefcase className="card-icon" />
            <h3>Statistics</h3>
          </div>
          <div className="card-content">
            <div className="stat-item">
              <div className="stat-number">{profile?.completedJobs || 0}</div>
              <div className="stat-label">Completed Jobs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{jobs.length}</div>
              <div className="stat-label">
                {user?.role === 'employer' ? 'Posted Jobs' : 'Available Jobs'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{profile?.experience || 0}</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            <FaBriefcase /> 
            {user?.role === 'employer' ? 'Your Posted Jobs' : 'Available Jobs'}
          </h2>
          <button 
            className="btn-primary"
            onClick={() => navigate(user?.role === 'employer' ? '/post-job' : '/jobs')}
          >
            {user?.role === 'employer' ? 'Post New Job' : 'View All Jobs'}
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <FaBriefcase className="empty-icon" />
            <p>
              {user?.role === 'employer' 
                ? "You haven't posted any jobs yet" 
                : 'No jobs available at the moment'}
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate(user?.role === 'employer' ? '/post-job' : '/jobs')}
            >
              {user?.role === 'employer' ? 'Post Your First Job' : 'Explore Jobs'}
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.slice(0, 6).map((job) => (
  <div key={job._id} className="job-card-mini">
    <h4>{job.title}</h4>
    <p className="job-category">{job.category}</p>
    <div className="job-info">
      <span>₹{job.wage?.amount}/{job.wage?.type}</span>
      <span className={`status-badge status-${job.status}`}>
        {job.status}
      </span>
    </div>
    {job.applicants?.length > 0 && user?.role === 'employer' && (
      <p className="applicants-count">
        <FaCheckCircle /> {job.applicants.length} applicant(s)
      </p>
    )}
    {user?.role === 'employer' && (
      <button 
        onClick={() => navigate(`/manage/${job._id}`)}
        className="btn-manage"
      >
        Manage Applications
      </button>
    )}
  </div>
))}

          </div>
        )}
      </div>

      {/* Skills Section for Workers */}
      {user?.role === 'worker' && profile?.skills && profile.skills.length > 0 && (
        <div className="dashboard-section">
          <h3>Your Skills</h3>
          <div className="skills-container">
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
