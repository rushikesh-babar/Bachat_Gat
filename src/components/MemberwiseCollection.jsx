import React, { useEffect, useState } from 'react';
import { getMemberwiseCollectionSummary } from '../services/savingsService';
import BackButton from './BackButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const MemberwiseCollection = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [shgTotal, setShgTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getMemberwiseCollectionSummary();
        const memberList = Array.isArray(data.memberwise) ? data.memberwise : [];
        setCollectionData(memberList);
        setShgTotal(data.totalSHGCollection ? parseFloat(data.totalSHGCollection) : 0);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch memberwise collection summary:", err);
        setError('Failed to load collection data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-start bg-light pt-5 pb-5">
      <div className="card shadow-lg p-4 rounded-4 w-100 mx-3" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary mb-2">Member-wise Collection Summary</h3>
          <p className="text-muted">A comprehensive overview of individual contributions and fines.</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Fetching collection details...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center animate__animated animate__fadeIn" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {collectionData.length === 0 ? (
              <div className="alert alert-warning text-center animate__animated animate__fadeIn" role="alert">
                <i className="bi bi-info-circle-fill me-2"></i> No collection data available for members.
              </div>
            ) : (
              <div className="table-responsive mb-4 animate__animated animate__fadeIn">
                <table className="table table-striped table-hover align-middle text-center caption-top">
                  <caption className="text-center fw-bold">List of all members and their total contributions</caption>
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">Member Id</th>
                      <th scope="col">Member Name</th>
                      <th scope="col">Total Contribution (₹)</th>
                      <th scope="col">Total Fine (₹)</th>
                      <th scope="col">Overall Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectionData.map((m) => (
                      <tr key={m.memberId}>
                        <th scope="row">{m.memberId}</th>
                        <td className="text-start fw-medium">{m.name}</td>
                        <td>₹{m.totalContribution ? m.totalContribution.toFixed(2) : '0.00'}</td>
                        <td>₹{m.totalFine ? m.totalFine.toFixed(2) : '0.00'}</td>
                        <td className="fw-bold text-success">
                          ₹{((m.totalContribution || 0) + (m.totalFine || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-secondary fw-bold">
                      <td colSpan="2" className="text-end">Total</td>
                      <td>
                        ₹
                        {collectionData
                          .reduce((sum, m) => sum + (m.totalContribution || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td>
                        ₹
                        {collectionData
                          .reduce((sum, m) => sum + (m.totalFine || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td>
                        ₹
                        {collectionData
                          .reduce(
                            (sum, m) =>
                              sum + (m.totalContribution || 0) + (m.totalFine || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div className="alert alert-info text-center fs-5 fw-bold py-3 border-0 rounded-3 shadow-sm animate__animated animate__fadeInUp">
              <i className="bi bi-wallet-fill me-2"></i>
              Total SHG Collection (incl. fines): ₹{shgTotal.toFixed(2)}
            </div>
          </>
        )}

        <div className="mt-4 text-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default MemberwiseCollection;
