import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, role }) => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('role');

      if (!token || !userType) {
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // ❌ Token expired
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setIsAllowed(false);
          setChecking(false);
          return;
        }

        // ✅ Role check
        if (Array.isArray(role)) {
          setIsAllowed(role.includes(userType));
        } else {
          setIsAllowed(userType === role);
        }

      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAllowed(false);
      }

      setChecking(false);
    };

    checkAccess();
  }, [role]);

  if (checking) {
    return <div className="text-center mt-5">Validating access...</div>;
  }

  return isAllowed ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
