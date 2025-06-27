import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LogoutButton from './LogoutButton';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (!decoded || !decoded.name || decoded.exp < currentTime) {
        throw new Error('Invalid or expired token');
      }
      setName(decoded.name || 'Admin');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }

    setLoading(false);
  }, [navigate]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3 text-muted">Verifying token...</p>
      </div>
    );

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light position-relative p-3">
      {/* Logout Button */}
      <div className="position-absolute" style={{ top: 20, right: 20 }}>
        <LogoutButton />
      </div>

      {/* Welcome Card */}
      <div
        className="card shadow-lg rounded-4 border-0 p-4 mb-4 text-center"
        style={{ width: '100%', maxWidth: '700px', background: 'linear-gradient(135deg, #e0f7fa, #ffffff)' }}
      >
        <i className="bi bi-person-badge display-2 text-info mb-3"></i>
        <h2 className="fw-bold text-info mb-2">Welcome, {name}!</h2>
        <p className="text-muted lead">Your centralized dashboard for managing members, collections, loans, and EMIs.</p>
      </div>

      {/* All Sections in One Row */}
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="row g-4 justify-content-center">

          {/* Member Management */}
          <div className="col-md-3">
            <div className="card h-100 shadow-sm rounded-4 border-0 text-center p-3" style={{ background: 'linear-gradient(135deg, #e6ffe6, #ffffff)' }}>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-people-fill display-4 text-success mb-3"></i>
                  <h6 className="card-title fw-bold text-success mb-3">Member Management</h6>
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-success btn-md rounded-pill" onClick={() => navigate('/view-members')}>
                    <i className="bi bi-eye me-2"></i> View Members
                  </button>
                  <button className="btn btn-outline-success btn-md rounded-pill" onClick={() => navigate('/memberform')}>
                    <i className="bi bi-person-plus me-2"></i> Add Member
                  </button>
                  <button className="btn btn-outline-success btn-md rounded-pill" onClick={() => navigate('/update-members')}>
                    <i className="bi bi-pencil-square me-2"></i> Update Member
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Management */}
          <div className="col-md-3">
            <div className="card h-100 shadow-sm rounded-4 border-0 text-center p-3" style={{ background: 'linear-gradient(135deg, #e6f7ff, #ffffff)' }}>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-cash-stack display-4 text-primary mb-3"></i>
                  <h6 className="card-title fw-bold text-primary mb-3">Collection Management</h6>
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-md rounded-pill" onClick={() => navigate('/select-month')}>
                    <i className="bi bi-cash-coin me-2"></i> Add Collection
                  </button>
                  <button className="btn btn-outline-primary btn-md rounded-pill" onClick={() => navigate('/memberwise-collection')}>
                    <i className="bi bi-bar-chart-fill me-2"></i> View Memberwise
                  </button>
                  <button className="btn btn-outline-primary btn-md rounded-pill" onClick={() => navigate('/select-monthwise-view')}>
                    <i className="bi bi-calendar3 me-2"></i> View Monthwise
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Management */}
          <div className="col-md-3">
            <div className="card h-100 shadow-sm rounded-4 border-0 text-center p-3" style={{ background: 'linear-gradient(135deg, #ffe6e6, #ffffff)' }}>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <i className="bi bi-currency-dollar display-4 text-danger mb-3"></i>
                  <h6 className="card-title fw-bold text-danger mb-3">Loan Management</h6>
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-danger btn-md rounded-pill" onClick={() => navigate('/select-member-loan')}>
                    <i className="bi bi-journal-plus me-2"></i> Add Loan
                  </button>
                  <button className="btn btn-outline-danger btn-md rounded-pill" onClick={() => navigate('/loans/active')}>
                    <i className="bi bi-list-columns-reverse me-2"></i> View Active Loans
                  </button>
                  <button
                    className="btn btn-outline-danger btn-md rounded-pill"
                    onClick={() => navigate('/close-loan')}
                  >
                    <i className="bi bi-x-circle me-2"></i> Close Loan
                  </button>
                  {/* Removed the blank div, as there are now 3 actual buttons */}
                </div>
              </div>
            </div>
          </div>

<div className="col-md-3">
  <div
    className="card h-100 shadow-sm rounded-4 border-0 text-center p-3"
    style={{ background: 'linear-gradient(135deg, #fff4e6, #ffffff)' }}
  >
    <div className="card-body d-flex flex-column align-items-center">
      {/* Centered icon and heading */}
      <i className="bi bi-receipt display-4 text-warning mb-2"></i>
      <h6 className="card-title fw-bold text-warning mb-3">EMI Management</h6>

      {/* Button immediately below heading */}
      <div className="d-grid gap-2 w-100">
        <button
          className="btn btn-warning btn-md rounded-pill"
          onClick={() => navigate('/select-emi-month')}
        >
          <i className="bi bi-cash me-2"></i> Add EMI
        </button>
      </div>
    </div>
  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
