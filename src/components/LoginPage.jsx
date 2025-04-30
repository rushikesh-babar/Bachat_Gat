import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password });
      const { token } = response.data; // Assuming the token is returned

      // Decode the JWT token
const decoded = jwtDecode(token);

      // Assuming the decoded token has the 'role' property
      if (decoded.role === 'Admin') {
        navigate('/dashboard/admin');
      } else if (decoded.role === 'Member') {
        navigate('/dashboard/regular');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
  className="d-flex justify-content-center align-items-center"
  style={{
    minHeight: '100vh',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    fontFamily: 'Poppins, sans-serif',
  }}
>
  <div
    className="card shadow-lg border-0"
    style={{
      width: '400px',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '1rem',
      color: 'white',
    }}
  >
    <div className="card-header text-center bg-transparent border-0">
      <h3 className="fw-bold">🔐 Member Login</h3>
    </div>
    <div className="card-body">
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-envelope-fill"></i>
            </span>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-light w-100 fw-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
    <div className="card-footer text-center border-0">
      <p className="mb-0 text-white">Don't have an account? <a href="/register" className="text-white text-decoration-underline">Sign up</a></p>
    </div>
  </div>
</div>

  );
};

export default LoginPage;
