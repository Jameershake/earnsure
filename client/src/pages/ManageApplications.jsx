import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaUser, FaCheck, FaTimes, FaStar, FaBriefcase } from 'react-icons/fa';

const ManageApplications = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'employer') {
      toast.error('Only employers can access this page');
      navigate('/');
      return;
    }
    fetchJobWithApplications();
  }, [jobId, user, navigate]);

  const fetchJobWithApplications = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      if (data.employer._id !== user._id) {
        toast.error('You do not have permission to manage this job');
        navigate('/dashboard');
        return;
      }

      setJob(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load applications');
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicantId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/applicants/${applicantId}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      toast.success(`Application ${status}!`);
      fetchJobWithApplications();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="manage-applications-page">
      <div className="applications-container">
        <div className="page-header">
          <FaBriefcase className="page-icon" />
          <div>
            <h1>Manage Applications</h1>
            <p className="job-title">{job?.title}</p>
          </div>
        </div>

        <div className="job-summary">
          <div className="summary-item">
            <span className="label">Total Applications:</span>
            <span className="value">{job?.applicants?.length || 0}</span>
          </div>
          <div className="summary-item">
            <span className="label">Pending:</span>
            <span className="value pending">
              {job?.applicants?.filter(a => a.status === 'pending').length || 0}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Accepted:</span>
            <span className="value accepted">
              {job?.applicants?.filter(a => a.status === 'accepted').length || 0}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Rejected:</span>
            <span className="value rejected">
              {job?.applicants?.filter(a => a.status === 'rejected').length || 0}
            </span>
          </div>
        </div>

        {!job?.applicants || job.applicants.length === 0 ? (
          <div className="no-applications">
            <FaUser className="no-apps-icon" />
            <h3>No applications yet</h3>
            <p>Applications will appear here once workers apply for this job</p>
          </div>
        ) : (
          <div className="applications-list">
            {job.applicants.map((applicant) => (
              <div key={applicant._id} className="applicant-card">
                <div className="applicant-header">
                  <div className="applicant-info">
                    <div className="applicant-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h3>{applicant.worker?.name}</h3>
                      <p className="applicant-email">{applicant.worker?.email}</p>
                      <p className="applicant-phone">{applicant.worker?.phone}</p>
                    </div>
                  </div>
                  <span className={`status-badge status-${applicant.status}`}>
                    {applicant.status}
                  </span>
                </div>

                <div className="applicant-details">
                  <div className="detail-row">
                    <span className="label">Location:</span>
                    <span>{applicant.worker?.location?.city}, {applicant.worker?.location?.state}</span>
                  </div>
                  {applicant.worker?.skills && applicant.worker.skills.length > 0 && (
                    <div className="detail-row">
                      <span className="label">Skills:</span>
                      <div className="skills-tags">
                        {applicant.worker.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Experience:</span>
                    <span>{applicant.worker?.experience || 0} years</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Rating:</span>
                    <span className="rating">
                      <FaStar /> {applicant.worker?.rating || 0}/5
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Applied On:</span>
                    <span>{new Date(applicant.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {applicant.status === 'pending' && (
                  <div className="applicant-actions">
                    <button
                      onClick={() => updateApplicationStatus(applicant._id, 'accepted')}
                      className="btn-accept"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(applicant._id, 'rejected')}
                      className="btn-reject"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
