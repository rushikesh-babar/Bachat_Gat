import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveLoans } from '../services/loanService'; // Ensure this path is correct
import { toast } from 'react-toastify'; // Correct toast import
import BackButton from './BackButton'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css'; // Import animate.css for animations

function OpenLoansListForClosure() {
  const [loans, setLoans] = useState([]); // Renamed from openLoans to loans for consistency
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchLoans = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const data = await getActiveLoans(); // Call your service to get active loans
        setLoans(data);
        if (data && data.length > 0) {
            toast.success('Open loans loaded successfully!', { autoClose: 1500 });
        } else {
            toast.info('No open loans found.', { autoClose: 1500 });
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch open loans. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error fetching open loans:', err);
      } finally {
        setLoading(false); // Set loading to false when fetching completes (success or error)
      }
    };

    fetchLoans(); // Execute the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs once after the initial render

  /**
   * Handles the click event for the "Close" button next to each loan.
   * Redirects to the LoanClosureDetails page, passing the loanId in the URL.
   * @param {number} loanId - The ID of the loan to close.
   */
  const handleCloseButtonClick = (loanId) => {
    navigate(`/close-loan/${loanId}/details`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Fetching open loans...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4 text-center border-danger animate__animated animate__fadeIn">
          <i className="bi bi-x-circle-fill text-danger display-4 mb-3"></i>
          <h4 className="text-danger">Error!</h4>
          <p className="text-muted">{error}</p>
          <BackButton /> {/* Using the BackButton component */}
        </div>
      </div>
    );
  }

  // Render the list of open loans
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center bg-light p-3">
      <div
        className="card shadow-lg rounded-4 border-0 p-4 animate__animated animate__fadeIn"
        style={{ width: '100%', maxWidth: '1000px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-card-checklist display-4 text-primary mb-3"></i>
          <h2 className="fw-bold text-primary">Open Loans for Closure</h2>
          <p className="text-muted">Select a loan to view its closure details and proceed.</p>
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
                  <th scope="col" className="text-center">Close Loan</th> {/* Changed from "Actions" to "Close Loan" */}
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanId}> {/* Using loan.loanId as key */}
                    <td className="text-center">{loan.loanId}</td>
                    <td>{loan.memberName}</td> {/* Assuming 'memberName' exists */}
                    <td className="text-end">₹{loan.loanAmount ? loan.loanAmount.toFixed(2) : '0.00'}</td>
                    <td>
                      {/* Consistent date formatting */}
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
                        className="btn btn-danger btn-sm rounded-pill px-3"
                        onClick={() => handleCloseButtonClick(loan.loanId)}
                      >
                        <i className="bi bi-x-circle me-1"></i> Close
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
        <BackButton /> {/* Using the BackButton component */}
      </div>
    </div>
  );
}

export default OpenLoansListForClosure;
