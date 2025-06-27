import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPaidEmis,
  fetchPendingEmis,
  payEmi
} from '../services/emiService';

import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaRegClock,
  FaRupeeSign,
  FaCalendarAlt
} from 'react-icons/fa';
import BackButton from './BackButton';

const MonthlyEmiCollection = () => {
  const { month, year } = useParams();
  const navigate = useNavigate();

  const [paidList, setPaidList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingLoanId, setSubmittingLoanId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const paidEmis = await fetchPaidEmis(month, year);
      setPaidList(paidEmis);

      const pendingEmis = await fetchPendingEmis(month, year);
      setPendingList(pendingEmis);

      const initialFormData = {};
      pendingEmis.forEach(emi => {
        initialFormData[emi.loanId] = {
          emiAmount: '',
          emiDate: null,
          fine: 'No',
          fineAmount: ''
        };
      });
      setFormData(initialFormData);
    } catch (err) {
      toast.error("Failed to fetch EMI data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!month || !year) {
      toast.warn('Month and Year are required. Redirecting.');
      navigate('/select-month');
      return;
    }
    fetchData();
  }, [month, year, navigate]);

  const handleInputChange = (loanId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [loanId]: {
        ...prev[loanId],
        [field]: value
      }
    }));
  };

  const handlePay = async (loanId) => {
    const data = formData[loanId];
    const emi = pendingList.find(e => e.loanId === loanId); // find EMI object

    const finalEmiAmount = data.emiAmount !== '' ? data.emiAmount : emi?.emiAmount;

     if (!data || !finalEmiAmount || !data.emiDate) {
       toast.warn("Please fill all required fields.");
      return;
    }

    if (isNaN(data.emiAmount) || parseFloat(data.emiAmount) <= 0) {
      toast.warn('EMI amount must be a positive number.');
      return;
    }
    if (data.fine === 'Yes' && (isNaN(data.fineAmount) || parseFloat(data.fineAmount) < 0)) {
      toast.warn('Fine amount must be a non-negative number.');
      return;
    }

     const formattedEmiDate = format(data.emiDate, 'yyyy-MM-dd');

    const payload = {
      loanId,
      emiAmount: parseFloat(finalEmiAmount),
      fineAmount: data.fine === 'Yes' ? parseFloat(data.fineAmount || 0) : 0,
      paymentStatus: 'PAID',
      emiMonth: month,
      emiYear: parseInt(year),
      emiDate: formattedEmiDate
    };

    setSubmittingLoanId(loanId);
    try {
      await payEmi(payload);
      toast.success("EMI Paid Successfully!");
      await fetchData();
    } catch (err) {
      toast.error("Error paying EMI.");
      console.error(err);
    } finally {
      setSubmittingLoanId(null);
    }
  };

  

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-start bg-light pt-5 pb-5">
      <div className="card shadow-lg p-md-5 p-3 rounded-4 w-100 mx-3" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold text-primary mb-2">
            <FaCalendarAlt className="me-2" />
                Monthly EMI Collection - {month} {year}
          </h4>

        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center flex-column py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3 text-muted">Fetching EMI data...</p>
          </div>
        ) : (
          <>
            <h5 className="text-success mb-3">
              <FaCheckCircle className="me-2" /> Paid EMIs ({paidList.length})
            </h5>
            {paidList.length === 0 ? (
              <div className="alert alert-info text-center">
                <FaRegClock className="me-2" /> No members have paid for this month yet.
              </div>
            ) : (
              <div className="table-responsive mb-5">
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>EMI Date</th>
                      <th>Amount</th>
                      <th>Fine</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidList.map((emi) => (
                      <tr key={emi.loanId}>
                        <td>{emi.memberId}</td>
                        <td className="text-start">{emi.memberName}</td>
                        <td>{emi.emiDate ? format(parseISO(emi.emiDate), 'dd MMM yyyy') : 'N/A'}</td>
                        <td>{emi.emiAmount?.toFixed(2)}</td>
                        <td>{emi.fineAmount?.toFixed(2)}</td>
                        <td><span className="badge bg-success">PAID</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h5 className="text-danger mb-3">
              <FaExclamationCircle className="me-2" /> Pending EMIs ({pendingList.length})
            </h5>
            {pendingList.length === 0 ? (
              <div className="alert alert-success text-center">
                <FaCheckCircle className="me-2" /> All members have paid for this month!
              </div>
            ) : (
              <div className="table-responsive mb-5">
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-warning">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Payment Date</th>
                      <th>Fine</th>
                      <th>Fine Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.map((emi) => {
                      const data = formData[emi.loanId] || {};
                      const isSubmitting = submittingLoanId === emi.loanId;

                      return (
                        <tr key={emi.loanId}>
                          <td>{emi.memberId}</td>
                          <td className="text-start">{emi.memberName}</td>
                          <td>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text"><FaRupeeSign /></span>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={data.emiAmount !== '' ? data.emiAmount : emi.emiAmount}
                                onChange={(e) => handleInputChange(emi.loanId, 'emiAmount', e.target.value)}
                                placeholder="e.g., 1200"
                                disabled={isSubmitting}
                              />
                            </div>
                          </td>
                          <td>
                            <ReactDatePicker
                              selected={data.emiDate}
                              onChange={(date) => handleInputChange(emi.loanId, 'emiDate', date)}
                              className="form-control form-control-sm"
                              dateFormat="dd/MM/yyyy"
                              placeholderText="DD/MM/YYYY"
                              disabled={isSubmitting}
                              showPopperArrow={false}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={data.fine || 'No'}
                              onChange={(e) => handleInputChange(emi.loanId, 'fine', e.target.value)}
                              disabled={isSubmitting}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </td>
                          <td>
                            {data.fine === 'Yes' && (
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                value={data.fineAmount || ''}
                                onChange={(e) => handleInputChange(emi.loanId, 'fineAmount', e.target.value)}
                                placeholder="0.00"
                                disabled={isSubmitting}
                              />
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary text-white"
                              disabled={isSubmitting}
                              onClick={() => handlePay(emi.loanId)}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="d-flex justify-content-center mt-4">
        <BackButton />
       </div>
      </div>
    </div>
  );
};

export default MonthlyEmiCollection;
