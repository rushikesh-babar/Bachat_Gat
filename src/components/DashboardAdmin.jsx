import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg rounded-4 border-0 p-4" style={{ width: '100%', maxWidth: '550px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-badge display-1 text-success mb-3"></i>
          <h2 className="fw-bold text-success">Welcome, Admin</h2>
          <p className="text-muted">Select an option below to manage members:</p>
        </div>

        <div className="d-grid gap-3">
          <button
            className="btn btn-outline-primary btn-lg rounded-pill"
            onClick={() => navigate('/view-members')}
          >
            <i className="bi bi-eye me-2"></i> View Members
          </button>

          <button
            className="btn btn-outline-success btn-lg rounded-pill"
            onClick={() => navigate('/memberform')}
          >
            <i className="bi bi-person-plus me-2"></i> Add Member
          </button>

          <button
            className="btn btn-outline-warning btn-lg rounded-pill"
            onClick={() => navigate('/update-member')}
          >
            <i className="bi bi-pencil-square me-2"></i> Update Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
