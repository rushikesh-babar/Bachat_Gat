import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LogoutButton from './LogoutButton';

const DashboardRegular = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('Member');

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

      setName(decoded.name || 'Member');
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
        style={{ width: '100%', maxWidth: '500px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-person-circle display-1 text-primary mb-3"></i>
          <h2 className="fw-bold text-primary">Welcome, {name}</h2>
          <p className="text-muted">Choose an action below:</p>
        </div>

        <div className="d-grid gap-3">
          <button
            className="btn btn-outline-primary btn-lg rounded-pill"
            onClick={() => navigate('/view-members')}
          >
            <i className="bi bi-eye me-2"></i> View Members
          </button>

          <button
            className="btn btn-outline-dark btn-lg rounded-pill"
            onClick={() => navigate('/memberwise-collection')}
          >
            <i className="bi bi-bar-chart-fill me-2"></i> View Memberwise Collection
          </button>

          {/* ✅ New Button: View Monthwise Collection */}
          <button
            className="btn btn-outline-secondary btn-lg rounded-pill"
            onClick={() => navigate('/select-monthwise-view')}
          >
            <i className="bi bi-calendar3 me-2"></i> View Monthwise Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardRegular;
