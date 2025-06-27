import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLoanDetails } from '../services/loanService';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';

function LoanDetailsPage() {
  const { loanId } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [paidEmis, setPaidEmis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getLoanDetails(loanId);
        setLoanDetails(data.loanDetails);
        setPaidEmis(data.paidEmis);
        toast.success(`Details for Loan ID ${loanId} loaded successfully!`, { autoClose: 1500 });
      } catch (err) {
        const errorMessage = err.message || `Failed to fetch loan details for Loan ID: ${loanId}.`;
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(`Error fetching loan details for ${loanId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [loanId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Fetching loan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
        <div className="card shadow-sm p-4 text-center border-danger animate__animated animate__fadeIn" style={{ maxWidth: '500px' }}>
          <i className="bi bi-x-circle-fill text-danger display-4 mb-3"></i>
          <h4 className="text-danger">Error!</h4>
          <p className="text-muted">{error}</p>
          <BackButton />
        </div>
      </div>
    );
  }

  if (!loanDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
        <div className="card shadow-sm p-4 text-center border-info animate__animated animate__fadeIn" style={{ maxWidth: '500px' }}>
          <i className="bi bi-question-circle-fill text-info display-4 mb-3"></i>
          <h4 className="text-info">Not Found!</h4>
          <p className="text-muted">No loan details found for Loan ID: <span className="fw-bold">{loanId}</span>.</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center bg-light p-3">
      <div className="card shadow-lg rounded-4 border-0 p-4 mb-4 animate__animated animate__fadeIn"
           style={{ width: '100%', maxWidth: '900px', background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}>
        <div className="text-center mb-4">
          <i className="bi bi-receipt display-4 text-success mb-3"></i>
          <h2 className="fw-bold text-success">Loan Details</h2>
          <p className="text-muted">Detailed information for Loan ID: <span className="fw-bold">{loanDetails.loanId}</span></p>
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
              <p className="mb-1"><strong>Loan Amount:</strong> <span className="text-success fw-bold">₹{loanDetails.loanAmount.toFixed(2)}</span></p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Loan Date:</strong>{' '}
                {loanDetails.loanDate
                  ? new Date(loanDetails.loanDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
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

        {/* EMI Section */}
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
                    <th scope="col" className="text-center">Date</th>
                    <th scope="col" className="text-center">Amount</th> {/* Changed text-end to text-center */}
                    <th scope="col" className="text-center">Fine</th>   {/* Changed text-end to text-center */}
                  </tr>
                </thead>
                <tbody>
                  {paidEmis.map((emi, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {emi.emiDate
                          ? new Date(emi.emiDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }).replace(/ /g, '-')
                          : 'N/A'}
                      </td>
                      <td className="text-center">₹{emi.emiAmount.toFixed(2)}</td> {/* Changed text-end to text-center */}
                      <td className="text-center">{emi.fineAmount ? `₹${emi.fineAmount.toFixed(2)}` : '₹0.00'}</td> {/* Changed text-end to text-center */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-4 w-100 d-flex justify-content-center">
        <BackButton />
      </div>
    </div>
  );
}

export default LoanDetailsPage;