import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-4">
      <button
        className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold shadow-sm"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left-circle me-2"></i>Back
      </button>
    </div>
  );
};

export default BackButton;
