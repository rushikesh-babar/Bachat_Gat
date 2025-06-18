import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMembers } from '../services/memberService'; 
import BackButton from './BackButton'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import 'animate.css'; 

const SelectMemberForLoan = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     
  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true); 
      setError(null);  
      try {
        const data = await fetchMembers();
        setMembers(data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
        setError('Failed to load member list. Please try again later.'); 
      } finally {
        setLoading(false); 
      }
    };
    loadMembers();
  }, []);

  const handleGo = () => {
    if (selectedMemberId) {
      navigate(`/add-loan-details/${selectedMemberId}`); 
    } else {
      setError('Please select a member to proceed with the loan.');
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      <div
        className="card shadow-lg p-4 rounded-4 w-100 mx-3 animate__animated animate__fadeInUp"
        style={{ maxWidth: '600px', background: 'linear-gradient(135deg, #ffffff, #f0f4f8)' }}
      >
        <div className="text-center mb-4 border-bottom pb-3">
          <i className="bi bi-person-check-fill display-4 text-primary mb-2 animate__animated animate__bounceIn"></i>
          <h3 className="fw-bold text-primary mb-2">Select Member for Loan</h3>
          <p className="text-muted fs-6">Choose a member from the list to add new loan details.</p>
        </div>

        {/* --- Conditional Rendering for Loading, Error, No Members --- */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading members...</span>
            </div>
            <p className="mt-2 text-muted">Loading members list...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center animate__animated animate__shakeX">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        ) : members.length === 0 ? (
          <div className="alert alert-info text-center animate__animated animate__fadeIn">
            <i className="bi bi-info-circle-fill me-2"></i> No members found. Please add members first.
          </div>
        ) : (
          <div className="mb-4 animate__animated animate__fadeIn">
            <label htmlFor="memberSelect" className="form-label fw-bold mb-2 text-secondary">Choose Member:</label>
            <select
              id="memberSelect"
              className="form-select form-select-lg shadow-sm"
              value={selectedMemberId}
              onChange={(e) => {
                setSelectedMemberId(e.target.value);
                setError(null); 
              }}
            >
              <option value="">-- Select a Member --</option>
              {members.map((member) => (
                <option key={member.memberId} value={member.memberId}>
                  {member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName} (ID: {member.memberId})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary btn-lg rounded-pill px-4 animate__animated animate__pulse"
            onClick={handleGo}
            disabled={!selectedMemberId || loading || members.length === 0}
          >
            <i className="bi bi-arrow-right-circle-fill me-2"></i> Proceed
          </button>
        </div>
      </div>

      <div className="mt-4 animate__animated animate__fadeInUp">
        <BackButton />
      </div>
    </div>
  );
};

export default SelectMemberForLoan;