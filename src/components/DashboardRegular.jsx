import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DashboardRegular = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg rounded-4 border-0 p-4" style={{ width: '100%', maxWidth: '500px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle display-1 text-primary mb-3"></i>
          <h2 className="fw-bold text-primary">Welcome, Member</h2>
          <p className="text-muted">Choose an action below:</p>
        </div>

        <div className="d-grid gap-3">
          <button
            className="btn btn-outline-primary btn-lg rounded-pill"
            onClick={() => navigate('/view-members')}
          >
            <i className="bi bi-eye me-2"></i> View Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardRegular;
