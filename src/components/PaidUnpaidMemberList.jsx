import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPaidUnpaidMembers } from '../services/savingsService';
import BackButton from './BackButton';

const PaidUnpaidMembersList = () => {
  const location = useLocation();

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [paidMembers, setPaidMembers] = useState([]);
  const [unpaidMembers, setUnpaidMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('month');
    const y = params.get('year');

    if (!m || !y) {
      setError('Month and Year are required.');
      setLoading(false);
      return;
    }

    setMonth(m);
    setYear(y);

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPaidUnpaidMembers(m, y);
        setPaidMembers(data.paid || []);
        setUnpaidMembers(data.unpaid || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 border-0 rounded-4">
        <h2 className="mb-4 text-center text-primary">Monthly Collection Status</h2>
        <p className="text-center mb-4">
          Month: <strong>{month}</strong> | Year: <strong>{year}</strong>
        </p>

        {loading && <div className="text-center fs-5">Loading...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && !error && (
          <>
            {/* Paid Members Table */}
            <h4 className="text-success mb-3">Paid Members</h4>
            {paidMembers.length === 0 ? (
              <div className="alert alert-info">No paid members found.</div>
            ) : (
              <div className="table-responsive mb-5">
                <table className="table table-bordered table-hover align-middle text-center">
                  <thead className="table-success">
                    <tr>
                      <th>Member ID</th>
                      <th>Name</th>
                      <th>Amount Paid</th>
                      <th>Fine Paid</th>
                      <th>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidMembers.map((m) => (
                      <tr key={m.memberId}>
                        <td>{m.memberId}</td>
                        <td>{m.memberName}</td> {/* Use combined memberName from DTO */}
                        <td>{m.amount}</td>
                        <td>{m.fineAmount}</td>
                        <td>{new Date(m.contributionDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Unpaid Members Table */}
            <h4 className="text-danger mb-3">Unpaid Members</h4>
            {unpaidMembers.length === 0 ? (
              <div className="alert alert-info">No unpaid members found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                  <thead className="table-danger">
                    <tr>
                      <th>Member ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidMembers.map((m) => (
                      <tr key={m.memberId}>
                        <td>{m.memberId}</td>
                        <td>{m.memberName}</td> {/* Use combined memberName */}
                        <td>{m.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="mt-4">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default PaidUnpaidMembersList;
