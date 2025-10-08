import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaRupeeSign, FaClock } from 'react-icons/fa';

const JobCard = ({ job, onApply }) => {
  const { t } = useTranslation();

  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.title}</h3>
        <span className={`badge badge-${job.status}`}>{job.status}</span>
      </div>

      <p className="job-description">
        {job.description.substring(0, 100)}
        {job.description.length > 100 && '...'}
      </p>

      <div className="job-details">
        <div className="detail-item">
          <FaMapMarkerAlt />
          <span>{job.location?.city}, {job.location?.state}</span>
        </div>

        <div className="detail-item">
          <FaRupeeSign />
          <span>₹{job.wage?.amount} / {job.wage?.type}</span>
        </div>

        <div className="detail-item">
          <FaClock />
          <span>{job.duration}</span>
        </div>
      </div>

      <div className="job-footer">
        <span className="posted-by">
          {t('jobs.postedBy')}: {job.employer?.name}
        </span>
        <div className="job-actions">
          <Link to={`/jobs/${job._id}`} className="btn-view">
            View Details
          </Link>
          <button onClick={() => onApply(job._id)} className="btn-apply">
            {t('jobs.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
