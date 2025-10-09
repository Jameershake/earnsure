import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { getJobById, applyForJob } from '../services/api';
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaClock, FaUser, FaCheckCircle, FaTimes } from 'react-icons/fa';
//import '../styles/JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Application form data
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    experience: '',
    availability: '',
    expectedWage: '',
    contactNumber: user?.phone || '',
    additionalInfo: ''
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    // Update contact number when user data is available
    if (user?.phone) {
      setApplicationData(prev => ({ ...prev, contactNumber: user.phone }));
    }
  }, [user]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openApplicationModal = () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user.role !== 'worker') {
      toast.error('Only workers can apply for jobs');
      return;
    }

    if (hasApplied) {
      toast.warning('You have already applied for this job');
      return;
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    // Validation
    if (!applicationData.coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    if (!applicationData.experience.trim()) {
      toast.error('Please mention your experience');
      return;
    }

    if (!applicationData.contactNumber.trim()) {
      toast.error('Please provide your contact number');
      return;
    }

    setApplying(true);
    try {
      // Send application with additional data
      await applyForJob(id, applicationData);
      toast.success('Application submitted successfully!');
      setShowModal(false);
      fetchJobDetails(); // Refresh to show updated applicant count
      
      // Reset form
      setApplicationData({
        coverLetter: '',
        experience: '',
        availability: '',
        expectedWage: '',
        contactNumber: user?.phone || '',
        additionalInfo: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply';
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const hasApplied = job?.applicants?.some(app => app.worker?._id === user?._id);

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
                    onClick={openApplicationModal}
                    className="btn-primary btn-block"
                  >
                    Apply Now
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

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="application-form">
              <div className="form-group">
                <label htmlFor="coverLetter">
                  Cover Letter <span className="required">*</span>
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Tell the employer why you're a great fit for this job..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">
                  Relevant Experience <span className="required">*</span>
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={applicationData.experience}
                  onChange={handleInputChange}
                  placeholder="Describe your relevant work experience (e.g., '5 years in construction')"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactNumber">
                    Contact Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={applicationData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expectedWage">Expected Wage (Optional)</label>
                  <input
                    type="text"
                    id="expectedWage"
                    name="expectedWage"
                    value={applicationData.expectedWage}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹500/day"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="availability">Availability (Optional)</label>
                <input
                  type="text"
                  id="availability"
                  name="availability"
                  value={applicationData.availability}
                  onChange={handleInputChange}
                  placeholder="When can you start? (e.g., 'Immediately' or 'After 1 week')"
                />
              </div>

              <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information (Optional)</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={applicationData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any other relevant information..."
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="btn-secondary"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
