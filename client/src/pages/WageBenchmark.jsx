import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getWages } from '../services/api';
import { FaChartLine, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

const WageBenchmark = () => {
  const { t } = useTranslation();
  const [wages, setWages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: ''
  });

  useEffect(() => {
    fetchWages();
  }, [filters]);

  const fetchWages = async () => {
    try {
      const { data } = await getWages(filters);
      setWages(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch wage data');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wage benchmarks...</p>
      </div>
    );
  }

  return (
    <div className="wage-page">
      <div className="wage-header">
        <FaChartLine className="page-icon" />
        <h1>Wage Benchmarks</h1>
        <p>Fair wage transparency for daily workers</p>
      </div>

      <div className="wage-container">
        <div className="wage-filters">
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
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city name"
            />
          </div>
        </div>

        {wages.length === 0 ? (
          <div className="no-data">
            <FaChartLine className="no-data-icon" />
            <h3>No wage data available</h3>
            <p>Wage benchmarks will be updated soon</p>
          </div>
        ) : (
          <div className="wage-grid">
            {wages.map((wage) => (
              <div key={wage._id} className="wage-card">
                <div className="wage-category">
                  <h3>{wage.category}</h3>
                  {wage.location && (
                    <p className="wage-location">
                      <FaMapMarkerAlt /> {wage.location.city}, {wage.location.state}
                    </p>
                  )}
                </div>

                <div className="wage-amount">
                  <div className="amount-item average">
                    <span className="label">Average Wage</span>
                    <span className="value">
                      <FaRupeeSign /> {wage.averageWage}
                    </span>
                  </div>

                  <div className="wage-range">
                    <div className="amount-item">
                      <span className="label">Minimum</span>
                      <span className="value">₹{wage.minWage || wage.averageWage * 0.8}</span>
                    </div>
                    <div className="amount-item">
                      <span className="label">Maximum</span>
                      <span className="value">₹{wage.maxWage || wage.averageWage * 1.2}</span>
                    </div>
                  </div>
                </div>

                <div className="wage-footer">
                  <small>Last updated: {new Date(wage.lastUpdated).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="info-box">
          <h3>About Wage Benchmarks</h3>
          <p>
            These wage benchmarks are collected from various sources and updated regularly
            to ensure fair compensation for daily wage workers. Use these as a reference
            when negotiating wages or posting jobs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WageBenchmark;
