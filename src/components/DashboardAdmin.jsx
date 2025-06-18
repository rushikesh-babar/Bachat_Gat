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
      if (!decoded || !decoded.name || !decoded.exp) {
        throw new Error('Invalid token structure');
      }

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      setName(decoded.name || 'Admin');
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }

    setLoading(false);
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Verifying token...</div>;

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light position-relative">
      <div className="position-absolute" style={{ top: 20, right: 20 }}>
        <LogoutButton />
      </div>

      <div
        className="card shadow-lg rounded-4 border-0 p-4"
        style={{ width: '100%', maxWidth: '550px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-person-badge display-1 text-success mb-3"></i>
          <h2 className="fw-bold text-success">Welcome, {name}</h2>
          <p className="text-muted">Select an option below to manage members:</p>
        </div>

        <div className="d-grid gap-3">
          <button className="btn btn-outline-primary btn-lg rounded-pill" onClick={() => navigate('/view-members')}>
            <i className="bi bi-eye me-2"></i> View Members
          </button>
          <button className="btn btn-outline-success btn-lg rounded-pill" onClick={() => navigate('/memberform')}>
            <i className="bi bi-person-plus me-2"></i> Add Member
          </button>
          <button className="btn btn-outline-warning btn-lg rounded-pill" onClick={() => navigate('/update-members')}>
            <i className="bi bi-pencil-square me-2"></i> Update Member
          </button>
          <button className="btn btn-outline-info btn-lg rounded-pill" onClick={() => navigate('/select-month')}>
            <i className="bi bi-cash-coin me-2"></i> Add Collection
          </button>
          <button className="btn btn-outline-dark btn-lg rounded-pill" onClick={() => navigate('/memberwise-collection')}>
            <i className="bi bi-bar-chart-fill me-2"></i> View Memberwise Collection
          </button>
          <button className="btn btn-outline-secondary btn-lg rounded-pill" onClick={() => navigate('/select-monthwise-view')}>
            <i className="bi bi-calendar3 me-2"></i> View Monthwise Collection
          </button>
          <button className="btn btn-outline-danger btn-lg rounded-pill" onClick={() => navigate('/select-member-loan')}>
            <i className="bi bi-journal-plus me-2"></i> Add Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
