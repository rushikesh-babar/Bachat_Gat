import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaidUnpaidMembers } from '../services/savingsService';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';
import 'animate.css'; 

const MonthwiseCollection = () => {
  const { month, year } = useParams();
  const navigate = useNavigate();
  const [paidMembers, setPaidMembers] = useState([]);
  const [unpaidMembers, setUnpaidMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaidUnpaidMembers(month, year);
      setPaidMembers(response.paid || []);
      setUnpaidMembers(response.unpaid || []);
    } catch (err) {
      console.error("Error fetching collection data:", err);
      setError('Failed to fetch collection details. Please ensure the month and year are valid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!month || !year) {
      alert('Month and Year are required to view this page.');
      navigate('/select-month-view');
      return;
    }
    loadMembers();
  }, [month, year, navigate]);

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-start bg-light py-5">
      <div className="card shadow-lg p-4 rounded-4 w-100 mx-3 animate__animated animate__fadeInUp" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-4 border-bottom pb-3">
          <h3 className="fw-bold text-primary mb-2">Month-wise Collection Summary</h3>
          <p className="text-muted fs-6">
            <span className="fw-bold">Month:</span> {month} &nbsp; | &nbsp;
            <span className="fw-bold">Year:</span> {year}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted fs-5">Fetching collection details...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center py-3 animate__animated animate__shakeX" role="alert">
            <i className="bi bi-exclamation-circle-fill me-2 fs-5"></i>
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <>
            {/* Paid Members Section - No changes here */}
            <h5 className="text-success mb-3 pb-2 border-bottom animate__animated animate__fadeInLeft">
              <i className="bi bi-check-circle-fill me-2"></i> Paid Members ({paidMembers.length})
            </h5>
            {paidMembers.length === 0 ? (
              <div className="alert alert-info text-center py-3 animate__animated animate__fadeIn" role="alert">
                <i className="bi bi-info-circle-fill me-2 fs-5"></i> No members have paid this month yet.
              </div>
            ) : (
              <div className="table-responsive mb-4 animate__animated animate__fadeIn">
                <table className="table table-striped table-hover align-middle text-center caption-top">
                  <caption className="text-center fw-bold text-muted">List of members who have paid their monthly contribution.</caption>
                  <thead className="table-success">
                    <tr>
                      <th scope="col" style={{ width: '10%' }}>Member ID</th>
                      <th scope="col" className="text-start ps-4 pe-2">Name</th>
                      <th scope="col">Amount (₹)</th>
                      <th scope="col">Fine Amount (₹)</th>
                      <th scope="col">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidMembers.map((member) => (
                      <tr key={member.memberId}>
                        <th scope="row">{member.memberId}</th>
                        <td className="text-start fw-medium text-capitalize ps-4 pe-2">{member.memberName}</td>
                        <td>₹{member.amount ? member.amount.toFixed(2) : '0.00'}</td>
                        <td>₹{member.fineAmount ? member.fineAmount.toFixed(2) : '0.00'}</td>
                        <td>
                          {member.contributionDate
                            ? new Date(member.contributionDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }).replace(/ /g, '-')
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

           {/* --- Unpaid Members Section --- */}
            <h5 className="text-danger mt-4 mb-3 pb-2 border-bottom animate__animated animate__fadeInLeft">
              <i className="bi bi-clock-history me-2"></i> Unpaid Members ({unpaidMembers.length})
            </h5>
            {unpaidMembers.length === 0 ? (
              <div className="alert alert-success text-center py-3 animate__animated animate__fadeIn" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i> All members have paid for this month! Great job!
              </div>
            ) : (
              <div className="table-responsive animate__animated animate__fadeIn">
                <table className="table table-striped table-hover align-middle caption-top">
                  <caption className="text-center fw-bold text-muted">
                    List of members who are yet to pay their monthly contribution.
                  </caption>
                  <thead className="table-warning">
                    <tr>
                      <th scope="col" className="text-center" style={{ width: '15%' }}>Member ID</th>
                      {/* Name column header: Changed to text-center */}
                      <th scope="col" className="text-center">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidMembers.map((member) => (
                      <tr key={member.memberId}>
                        <th scope="row" className="text-center">{member.memberId}</th>
                        {/* Name data: Changed to text-center and removed padding as it's not needed for centering */}
                        <td className="text-center text-capitalize">{member.memberName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </>
        )}

        <div className="mt-4 text-center pt-3 border-top">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default MonthwiseCollection;