import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { validateToken } from '../services/memberService';

const ProtectedRoute = ({ children, role }) => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
     const userType = localStorage.getItem('role');  // ✅ matches what LoginPage stores

      // If no token or no userType, redirect
      if (!token || !userType) {
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      // Validate token via API
      const isValid = await validateToken();
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsAllowed(false);
        setChecking(false);
        return;
      }

      // Role check
      if (Array.isArray(role)) {
        setIsAllowed(role.includes(userType));
      } else {
        setIsAllowed(userType === role);
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
