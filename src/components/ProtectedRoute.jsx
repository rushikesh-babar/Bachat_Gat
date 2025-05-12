// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  let decodedToken = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      decodedToken = null;
    }
  }

  // Check if the role matches
  const userRole = decodedToken?.role;
  const isAuthorized = Array.isArray(role) ? role.includes(userRole) : userRole === role;

  if (!token || !isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
