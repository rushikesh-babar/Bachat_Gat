import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { loginUser } from '../services/memberService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { token } = await loginUser(email, password);
      const decoded = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('role', decoded.role); // Save the role to localStorage

      if (decoded.role === 'Admin') {
		    console.log('Navigating to /dashboards/admin');

        navigate('/dashboards/admin');
      } else if (decoded.role === 'Member') {
		    console.log('Navigating to /dashboards/regular');

        navigate('/dashboards/regular');
      } else {
        setError('Invalid role detected.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
        fontFamily: 'Poppins, sans-serif',
        padding: '20px',
      }}
    >
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="card-header bg-primary text-white text-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h3 className="mb-0">Member Login</h3>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
