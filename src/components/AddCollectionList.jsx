import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPaidUnpaidMembers, addMonthlyCollection } from '../services/savingsService';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';
import '../styles/AddCollectionList.css';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { toast } from 'react-toastify';

const AddCollectionList = () => {
  const { month, year } = useParams();
  const navigate = useNavigate();
  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const [formData, setFormData] = useState({});
  const [successMap, setSuccessMap] = useState({});

  const loadMembers = async () => {
    try {
      const response = await getPaidUnpaidMembers(month, year);
      setPaidList(response.paid);
      setUnpaidList(response.unpaid);
    } catch (err) {
      // Replaced alert with toast.error
      toast.error('Failed to fetch member data.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!month || !year) {
      // Replaced alert with toast.warn
      toast.warn('Month and Year are required. Redirecting...');
      navigate('/select-month');
      return;
    }

    const fetchData = async () => {
      await loadMembers();
    };

    fetchData();
  }, [month, year, navigate]);

  const handleInputChange = (memberId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (memberId) => {
    const data = formData[memberId];
    if (!data || !data.amount || !data.paymentDate) {
      toast.warn('Please fill all required fields (Amount and Payment Date).');
      return;
    }

    const isoDate = format(parse(data.paymentDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');

    const payload = {
      memberId: parseInt(memberId),
      savingsMonth: month,
      savingsYear: parseInt(year),
      amount: parseFloat(data.amount),
      fineAmount: data.fine === 'Yes' ? parseFloat(data.fineAmount || 0) : 0,
      paymentDate: isoDate,
    };

    try {
      await addMonthlyCollection(payload);
      setSuccessMap((prev) => ({ ...prev, [memberId]: true }));
      toast.success(`Collection added for Member ID ${memberId}`);
      await loadMembers();
    } catch (error) {
      // Replaced alert with toast.error
      toast.error('Error submitting collection.');
      console.error(error);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-start bg-light pt-5">
      <div className="card shadow-lg p-4 rounded-4 w-100 mx-3" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold text-primary mb-2">Monthly Collection</h4>
          <p className="text-muted">
            <strong>Month:</strong> {month} &nbsp; | &nbsp;
            <strong>Year:</strong> {year}
          </p>
        </div>

        {/* Paid Members */}
        <h5 className="text-success">✅ Paid Members</h5>
        {paidList.length === 0 ? (
          <p className="text-muted">No paid members yet.</p>
        ) : (
          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Fine Amount</th>
                  <th>Status</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {paidList.map((member) => (
                  <tr key={member.memberId}>
                    <td>{member.memberId}</td>
                    <td>{member.memberName}</td>
                    <td>{member.amount}</td>
                    <td>{member.fineAmount}</td>
                    <td>
                      <span className="text-success fw-bold">Paid</span>
                    </td>
                    <td>
                      {member.contributionDate
                        ? new Date(member.contributionDate).toLocaleDateString('en-GB')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Unpaid Members */}
        <h5 className="text-danger">🕒 Unpaid Members</h5>
        {unpaidList.length === 0 ? (
          <p className="text-muted">All members have paid.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-warning">
                <tr>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Fine</th>
                  <th>Fine Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unpaidList.map((member) => {
                  const mData = formData[member.memberId] || {};
                  const isSuccess = successMap[member.memberId];
                  return (
                    <tr key={member.memberId}>
                      <td>{member.memberId}</td>
                      <td>{member.memberName}</td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={mData.amount || ''}
                          onChange={(e) =>
                            handleInputChange(member.memberId, 'amount', e.target.value)
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <ReactDatePicker
                          selected={
                            mData.paymentDate
                              ? parse(mData.paymentDate, 'dd/MM/yyyy', new Date())
                              : null
                          }
                          onChange={(date) =>
                            handleInputChange(
                              member.memberId,
                              'paymentDate',
                              date ? format(date, 'dd/MM/yyyy') : ''
                            )
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          value={mData.fine || 'No'}
                          onChange={(e) =>
                            handleInputChange(member.memberId, 'fine', e.target.value)
                          }
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </td>
                      <td>
                        {mData.fine === 'Yes' && (
                          <input
                            type="number"
                            step="0.01"
                            value={mData.fineAmount || ''}
                            onChange={(e) =>
                              handleInputChange(member.memberId, 'fineAmount', e.target.value)
                            }
                            className="form-control"
                          />
                        )}
                      </td>
                      <td>
                        {isSuccess ? (
                          <span className="text-success fw-bold">Added</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSubmit(member.memberId)}
                          >
                            Add
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default AddCollectionList;