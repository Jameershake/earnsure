import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { getJobById, applyForJob } from '../services/api';
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaClock, FaUser, FaCheckCircle } from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data } = await getJobById(id);
      setJob(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load job details');
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user.role !== 'worker') {
      toast.error('Only workers can apply for jobs');
      return;
    }

    setApplying(true);
    try {
      await applyForJob(id);
      toast.success('Applied successfully!');
      fetchJobDetails(); // Refresh to show updated applicant count
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const hasApplied = job?.applicants?.some(app => app.worker._id === user?._id);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error-container">
        <h2>Job not found</h2>
        <button onClick={() => navigate('/jobs')} className="btn-primary">
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">
        <div className="job-details-header">
          <div className="header-left">
            <span className={`status-badge status-${job.status}`}>{job.status}</span>
            <h1>{job.title}</h1>
            <div className="job-meta">
              <span><FaBriefcase /> {job.category}</span>
              <span><FaMapMarkerAlt /> {job.location?.city}, {job.location?.state}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="wage-display">
              <FaRupeeSign />
              <div>
                <span className="wage-amount">{job.wage?.amount}</span>
                <span className="wage-type">/ {job.wage?.type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="job-details-content">
          <div className="main-content">
            <section className="detail-section">
              <h3>Job Description</h3>
              <p>{job.description}</p>
            </section>

            <section className="detail-section">
              <h3>Job Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <FaClock className="info-icon" />
                  <div>
                    <span className="info-label">Duration</span>
                    <span className="info-value">{job.duration}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <div>
                    <span className="info-label">Workers Needed</span>
                    <span className="info-value">{job.workersNeeded}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <span className="info-label">Location</span>
                    <span className="info-value">{job.location?.address}</span>
                  </div>
                </div>
                {job.startDate && (
                  <div className="info-item">
                    <FaClock className="info-icon" />
                    <div>
                      <span className="info-label">Start Date</span>
                      <span className="info-value">
                        {new Date(job.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {job.requirements && job.requirements.length > 0 && (
              <section className="detail-section">
                <h3>Requirements</h3>
                <ul className="requirements-list">
                  {job.requirements.map((req, index) => (
                    <li key={index}>
                      <FaCheckCircle className="check-icon" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="sidebar-content">
            <div className="employer-card">
              <h4>Posted By</h4>
              <div className="employer-info">
                <div className="employer-avatar">
                  <FaUser />
                </div>
                <div>
                  <h5>{job.employer?.name}</h5>
                  <p>{job.employer?.email}</p>
                  <p>{job.employer?.phone}</p>
                </div>
              </div>
            </div>

            {user?.role === 'worker' && job.status === 'open' && (
              <div className="apply-card">
                {hasApplied ? (
                  <button className="btn-applied" disabled>
                    <FaCheckCircle /> Already Applied
                  </button>
                ) : (
                  <button 
                    onClick={handleApply} 
                    disabled={applying}
                    className="btn-primary btn-block"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
                <p className="applicants-info">
                  {job.applicants?.length || 0} people have applied
                </p>
              </div>
            )}

            <div className="posted-info">
              <p>Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
