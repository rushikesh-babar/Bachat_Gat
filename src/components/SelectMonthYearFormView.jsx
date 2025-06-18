import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';

const SelectMonthYearForView = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const handleGo = () => {
    if (month && year) {
      navigate(`/monthwise-collection/${month}/${year}`);
    } else {
      alert('Please select both month and year');
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i); // Generates years from 5 years ago to 4 years in the future

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div
        className="card shadow-lg rounded-4 p-4 mb-3"
        style={{ width: '100%', maxWidth: '500px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">View Month-wise Collection</h3>
          <p className="text-muted">Select the month and year to view collection details</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Month:</label>
          <select className="form-select" value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Year:</label>
          <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Select Year</option>
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary btn-sm px-4 rounded-pill mx-auto d-block" onClick={handleGo}>
            <i className="bi bi-eye-fill me-2"></i> View Collection
        </button>

      </div>

      {/* Back button with small margin below card */}
      <div className="mb-3">
        <BackButton />
      </div>
    </div>
  );
};

export default SelectMonthYearForView;