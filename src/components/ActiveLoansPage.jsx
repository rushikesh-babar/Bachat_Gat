import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveLoans } from '../services/loanService';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css'; 

function ActiveLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getActiveLoans();
        setLoans(data);
        if (data && data.length > 0) {
            toast.success('Active loans loaded successfully!', { autoClose: 1500 });
        } else {
            toast.info('No active loans found.', { autoClose: 1500 });
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch active loans. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error fetching active loans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleViewDetails = (loanId) => {
    navigate(`/loans/${loanId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Fetching active loans...</p>
        </div>
      </div>
    );
  }

  // Improved Error State
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4 text-center border-danger animate__animated animate__fadeIn">
          <i className="bi bi-x-circle-fill text-danger display-4 mb-3"></i>
          <h4 className="text-danger">Error!</h4>
          <p className="text-muted">{error}</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center bg-light p-3">
      <div
        className="card shadow-lg rounded-4 border-0 p-4 animate__animated animate__fadeIn"
        style={{ width: '100%', maxWidth: '1000px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-card-checklist display-4 text-primary mb-3"></i>
          <h2 className="fw-bold text-primary">Active Loans List</h2>
          <p className="text-muted">Overview of all active loans in the system.</p>
        </div>

        {loans.length === 0 ? (
          <div className="alert alert-info text-center animate__animated animate__fadeIn" role="alert">
            <i className="bi bi-info-circle me-2"></i> No active loans found at this time.
          </div>
        ) : (
          <div className="table-responsive animate__animated animate__fadeIn">
            <table className="table table-striped table-hover table-bordered align-middle">
              <thead className="table-primary">
                <tr>
                  <th scope="col" className="text-center">Loan ID</th>
                  <th scope="col">Member Name</th>
                  <th scope="col" className="text-end">Loan Amount</th>
                  <th scope="col">Loan Date</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td className="text-center">{loan.loanId}</td>
                    <td>{loan.memberName}</td>
                    <td className="text-end">₹{loan.loanAmount ? loan.loanAmount.toFixed(2) : '0.00'}</td>
                    <td>
                      {/* Changed date formatting here */}
                      {loan.loanDate
                        ? new Date(loan.loanDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }).replace(/ /g, '-')
                        : 'N/A'}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-info btn-sm rounded-pill px-3"
                        onClick={() => handleViewDetails(loan.loanId)}
                      >
                        <i className="bi bi-info-circle me-1"></i> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-4 w-100 d-flex justify-content-center">
        <BackButton />
      </div>
    </div>
  );
}

export default ActiveLoansPage;