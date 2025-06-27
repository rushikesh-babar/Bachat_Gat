import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLoanClosureSummary, closeLoan } from '../services/loanService';
import { toast } from 'react-toastify';
import BackButton from './BackButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';

function LoanClosureDetails() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loanDetails, setLoanDetails] = useState(null);
  const [paidEmis, setPaidEmis] = useState([]);
  const [closeAmount, setCloseAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchClosureData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLoanClosureSummary(loanId);
        setLoanDetails(data.loanDetails);
        setPaidEmis(data.paidEmis);
        setCloseAmount(data.closingAmount);
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch loan closure data.";
        console.error("Error fetching loan closure data:", err);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchClosureData();
  }, [loanId]);

  const handleConfirmCloseLoan = async () => {
    const confirmed = window.confirm("Are you sure you want to confirm and close this loan?");
    if (!confirmed) return;

    setIsClosing(true);
    setError(null);
    try {
      const message = await closeLoan(loanId);
      toast.success(message || 'Loan closed successfully!');
      navigate('/close-loan');
    } catch (err) {
      const errorMessage = err.message || "Failed to close loan.";
      console.error("Error closing loan:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Fetching loan closure details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4 text-center border-danger animate__animated animate__fadeIn">
          <i className="bi bi-x-circle-fill text-danger display-4 mb-3"></i>
          <h4 className="text-danger">Error!</h4>
          <p className="text-muted">{error}</p>
          <BackButton targetPath="/close-loan" />
        </div>
      </div>
    );
  }

  if (!loanDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4 text-center border-warning animate__animated animate__fadeIn">
          <i className="bi bi-exclamation-circle-fill text-warning display-4 mb-3"></i>
          <h4 className="text-warning">Loan Not Found!</h4>
          <p className="text-muted">No details found for Loan ID: {loanId}.</p>
          <BackButton targetPath="/close-loan" />
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
          <i className="bi bi-cash-coin display-4 text-primary mb-3"></i>
          <h2 className="fw-bold text-primary">Loan Closure Details</h2>
          <p className="text-muted">Review for Loan ID: <strong>{loanId}</strong></p>
        </div>

        {/* Loan Overview Section */}
        <div className="mb-4 p-3 bg-white rounded-3 shadow-sm border border-light">
          <h3 className="h5 text-primary mb-3 d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i> Loan Overview
          </h3>
          <div className="row g-2">
            <div className="col-md-6">
              <p className="mb-1"><strong>Member Name:</strong> {loanDetails.memberName}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><strong>Member ID:</strong> {loanDetails.memberId}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><strong>Loan Amount:</strong> ₹{loanDetails.loanAmount?.toFixed(2)}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Loan Date:</strong>{' '}
                {loanDetails.loanDate
                  ? new Date(loanDetails.loanDate).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    }).replace(/ /g, '-')
                  : 'N/A'}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><strong>Interest Rate:</strong> {loanDetails.interestRate}%</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1"><strong>Duration:</strong> {loanDetails.duration} months</p>
            </div>
          </div>
        </div>

        {/* EMI History Section */}
        <div className="p-3 bg-white rounded-3 shadow-sm border border-light">
          <h3 className="h5 text-primary mb-3 d-flex align-items-center">
            <i className="bi bi-currency-rupee me-2"></i> EMI Payments
          </h3>
          {paidEmis.length === 0 ? (
            <div className="alert alert-warning text-center animate__animated animate__fadeIn" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i> No EMI payments recorded yet for this loan.
            </div>
          ) : (
            <div className="table-responsive animate__animated animate__fadeIn">
              <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-success">
                  <tr>
                    <th className="text-center">Date</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {paidEmis.map((emi, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {emi.emiDate
                          ? new Date(emi.emiDate).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            }).replace(/ /g, '-')
                          : 'N/A'}
                      </td>
                      <td className="text-center">₹{emi.emiAmount?.toFixed(2)}</td>
                      <td className="text-center">₹{emi.fineAmount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Final Closing Amount */}
        <div className="card mb-4 text-center bg-light shadow-sm animate__animated animate__fadeInUp">
          <div className="card-body py-4">
            <h3 className="card-title h4 text-primary mb-3">Final Amount to Close Loan:</h3>
            <p className="display-3 fw-bold text-success mb-3">₹{closeAmount?.toFixed(2)}</p>
            <p className="text-muted fst-italic">Includes principal, interest, and fine up to today.</p>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="d-flex justify-content-center mt-4 animate__animated animate__fadeInUp">
          <button
            className="btn btn-success btn-md rounded-pill px-4 py-2"
            onClick={handleConfirmCloseLoan}
            disabled={isClosing}
          >
            {isClosing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Closing Loan...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill me-2"></i> Confirm & Close Loan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-4 w-100 d-flex justify-content-center">
        <BackButton targetPath="/close-loan" />
      </div>
    </div>
  );
}

export default LoanClosureDetails;
