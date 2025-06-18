import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { addMonthlyCollection } from '../services/savingsService';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';

const AddCollectionForm = () => {
  const { memberId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  const [contriDate, setContriDate] = useState('');
  const [contriAmount, setContriAmount] = useState('');
  const [fine, setFine] = useState('No');
  const [fineAmount, setFineAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      memberId: parseInt(memberId),
      savingsMonth: month,
      savingsYear: parseInt(year),
      amount: parseFloat(contriAmount),
      fineAmount: fine === 'Yes' ? parseFloat(fineAmount) : 0,
      paymentDate: contriDate,
    };

    try {
      await addMonthlyCollection(payload);
      setSuccessMessage('Collection added successfully!');
    } catch (error) {
      alert(error.message || 'Failed to add collection');
    }
  };

  useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      navigate(`/collection-summary?month=${month}&year=${year}`);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [successMessage, month, year, navigate]);

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: 'linear-gradient(135deg, #f0f4ff, #ffffff)' }}
    >
      <div
        className="card shadow-lg rounded-4 p-4"
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <h4 className="fw-semibold text-primary text-center mb-3">
          Add Monthly Collection
        </h4>

        <p className="text-center text-muted mb-4">
          <strong>Member ID:</strong> #{memberId} <br />
          <strong>Month:</strong> <span className="text-primary">{month}</span> &nbsp; | &nbsp;
          <strong>Year:</strong> <span className="text-primary">{year}</span>
        </p>

        {successMessage && (
          <div className="alert alert-success text-center py-2">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Contribution Date</label>
            <input
              type="date"
              className="form-control"
              value={contriDate}
              onChange={(e) => setContriDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={contriAmount}
              onChange={(e) => setContriAmount(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Fine</label>
            <select
              className="form-select"
              value={fine}
              onChange={(e) => setFine(e.target.value)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {fine === 'Yes' && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Fine Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold rounded"
            style={{ padding: '8px 0' }}
          >
            Submit
          </button>
        </form>

        <div className="mt-3">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default AddCollectionForm;
