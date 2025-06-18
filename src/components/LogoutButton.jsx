import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT
    navigate("/login"); // Redirect to login
  };

  return (
    <button
        onClick={handleLogout}
        className="btn btn-danger position-absolute"
        style={{ top: 20, right: 20 }}
      >
        <i className="bi bi-box-arrow-right me-1"></i> Logout
      </button>
  );
};

export default LogoutButton;
