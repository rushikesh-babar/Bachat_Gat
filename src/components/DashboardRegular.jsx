import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { validateToken } from '../services/memberService';

const DashboardRegular = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Verifying token...</div>;

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow-lg rounded-4 border-0 p-4"
        style={{ width: '100%', maxWidth: '500px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
      >
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
