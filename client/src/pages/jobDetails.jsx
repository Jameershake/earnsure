import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyForJob } from '../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const { data } = await getJobById(id);
      setJob(data);
      
      // Check if user already applied
      if (userInfo._id && data.applicants) {
        const alreadyApplied = data.applicants.some(
          app => app.worker?._id === userInfo._id || app.worker === userInfo._id
        );
        setHasApplied(alreadyApplied);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!userInfo._id) {
      alert('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (userInfo.role !== 'worker') {
      alert('Only workers can apply for jobs');
      return;
    }

    if (hasApplied) {
      alert('You have already applied for this job');
      return;
    }

    if (window.confirm('Are you sure you want to apply for this job?')) {
      try {
        setApplying(true);
        await applyForJob(id);
        setHasApplied(true);
        alert('Application submitted successfully!');
        fetchJobDetails(); // Refresh job data
      } catch (err) {
        console.error('Error applying:', err);
        alert(err.response?.data?.message || 'Failed to apply. Please try again.');
      } finally {
        setApplying(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location?.city}, {job.location?.state}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {job.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Wage Info */}
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Wage</p>
                  <p className="text-3xl font-bold text-green-600">₹{job.wage}</p>
                  <p className="text-sm text-gray-600">{job.wageType}</p>
                </div>
                {job.workersNeeded && (
                  <div>
                    <p className="text-sm text-gray-600">Workers Needed</p>
                    <p className="text-2xl font-bold text-gray-800">{job.workersNeeded}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {job.duration && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-800">{job.duration}</p>
                  </div>
                </div>
              )}
              {job.startDate && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(job.startDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-800 capitalize">{job.status}</p>
                </div>
              </div>
            </div>

            {/* Employer Info */}
            {job.employer && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Posted By</h2>
                <p className="text-gray-700 font-medium">{job.employer.name}</p>
                {job.employer.email && (
                  <p className="text-sm text-gray-600">{job.employer.email}</p>
                )}
                {job.employer.phone && (
                  <p className="text-sm text-gray-600">{job.employer.phone}</p>
                )}
              </div>
            )}

            {/* Apply Button */}
            {userInfo.role === 'worker' && (
              <div className="flex items-center justify-between border-t pt-6">
                {hasApplied ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full text-center">
                    <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 font-semibold">Application Submitted</p>
                    <p className="text-sm text-gray-600 mt-1">You have already applied for this job</p>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying || job.status !== 'open'}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                      applying || job.status !== 'open'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {applying ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying...
                      </span>
                    ) : job.status !== 'open' ? (
                      'Job Closed'
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                )}
              </div>
            )}

            {userInfo.role === 'employer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-700">Employers cannot apply for jobs</p>
              </div>
            )}

            {!userInfo._id && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-700 mb-3">Please login to apply for this job</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
