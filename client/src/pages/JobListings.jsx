import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getJobs, applyForJob } from '../services/api';
import JobCard from '../components/JobCard';
import AuthContext from '../context/AuthContext';
import { FaBriefcase, FaSearch, FaFilter } from 'react-icons/fa';

const JobListings = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minWage: '',
    search: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const fetchJobs = async () => {
    try {
      const { data } = await getJobs({ status: 'open' });
      setJobs(data);
      setFilteredJobs(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];

    // Search filter
    if (filters.search) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(job => job.category === filters.category);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(job => 
        job.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        job.location?.state?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Min wage filter
    if (filters.minWage) {
      result = result.filter(job => job.wage.amount >= Number(filters.minWage));
    }

    setFilteredJobs(result);
  };

  const handleApply = async (jobId) => {
    if (!user) {
      toast.error('Please login to apply');
      return;
    }

    if (user.role !== 'worker') {
      toast.error('Only workers can apply for jobs');
      return;
    }

    try {
      await applyForJob(jobId);
      toast.success('Applied successfully!');
      fetchJobs(); // Refresh jobs
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      minWage: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div className="header-content">
          <FaBriefcase className="page-icon" />
          <div>
            <h1>{t('jobs.title')}</h1>
            <p>{jobs.length} jobs available</p>
          </div>
        </div>
      </div>

      <div className="jobs-container">
        {/* Filters Section */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3><FaFilter /> Filters</h3>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search jobs..."
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="construction">Construction</option>
              <option value="agriculture">Agriculture</option>
              <option value="domestic">Domestic Help</option>
              <option value="delivery">Delivery</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City or State"
            />
          </div>

          <div className="filter-group">
            <label>Minimum Wage (₹)</label>
            <input
              type="number"
              name="minWage"
              value={filters.minWage}
              onChange={handleFilterChange}
              placeholder="500"
              min="0"
            />
          </div>

          <div className="filter-stats">
            <p><strong>{filteredJobs.length}</strong> jobs match your filters</p>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-content">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <FaBriefcase className="no-jobs-icon" />
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or check back later</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} onApply={handleApply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
