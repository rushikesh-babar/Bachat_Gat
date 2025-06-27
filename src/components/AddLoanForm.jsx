import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMembers } from '../services/memberService';
import { addLoan, fetchLoanTypes } from '../services/loanService'; 
import BackButton from './BackButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AddLoanForm = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loanTypes, setLoanTypes] = useState([]); 
  const [loanData, setLoanData] = useState({
    loanAmount: '', 
    interestRate: '',
    duration: '',
    startDate: null,
    loanTypeId: '' 
  });
  const [calculatedEMI, setCalculatedEMI] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submittedLoanDetails, setSubmittedLoanDetails] = useState(null);
  const [loadingMember, setLoadingMember] = useState(true);
  const [loadingLoanTypes, setLoadingLoanTypes] = useState(true); 
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // --- Member fetching useEffect ---
  useEffect(() => {
    const getMember = async () => {
      setLoadingMember(true);
      setError(null);
      try {
        const allMembers = await fetchMembers();
        const selectedMember = allMembers.find((m) => m.memberId?.toString() === memberId);

        if (selectedMember) {
          setMember(selectedMember);
        } else {
          setError(`Member with ID "${memberId}" not found.`);
          toast.warn(`Member with ID "${memberId}" not found.`);
        }
      } catch (err) {
        console.error('Failed to fetch member details:', err);
        toast.error('Failed to load member details. Please check your network or try again.');
        setError('Failed to load member details. Please check your network or try again.');
      } finally {
        setLoadingMember(false);
      }
    };

    if (memberId) {
      getMember();
    } else {
      setLoadingMember(false);
      setError('No member ID provided. Please select a member first.');
      toast.warn('No member ID provided. Please select a member first.');
    }
  }, [memberId, navigate]);

  // --- useEffect to fetch Loan Types ---
  useEffect(() => {
    const getLoanTypes = async () => {
      setLoadingLoanTypes(true);
      try {
        const data = await fetchLoanTypes();
        if (Array.isArray(data)) {
          setLoanTypes(data);
        } else {
          console.error("API response for loan types was not an array. Actual data:", data);
          setError("Failed to load loan types: Invalid data format from API. Please ensure you are logged in as an admin.");
          toast.error("Failed to load loan types: Invalid data received.");
          setLoanTypes([]); 
        }
      } catch (err) {
        console.error('Failed to fetch loan types:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Please ensure you are logged in as an admin or have network access.';
        setError(`Failed to load loan types: ${errorMessage}`);
        toast.error(`Failed to load loan types: ${errorMessage}`);
        setLoanTypes([]); 
      } finally {
        setLoadingLoanTypes(false);
      }
    };

    getLoanTypes();
  }, []); // Empty dependency array means this runs once on mount

  // --- Input Change Handlers ---
  const handleChange = (e) => {
  setLoanData((prevData) => ({
    ...prevData,
    [e.target.name]: e.target.value,
  }));

  if (error) {
    setError(null);
  }
};

const handleLoanTypeChange = (e) => {
  const selectedLoanTypeId = e.target.value;
  const selectedLoanType = loanTypes.find(
    (type) => type.loanTypeId?.toString() === selectedLoanTypeId
  );

  setLoanData((prevData) => ({
    ...prevData,
    loanTypeId: selectedLoanTypeId,
    interestRate: selectedLoanType ? selectedLoanType.interestRate?.toString() : '',
  }));
  setError(null);
};

const handleDateChange = (date) => {
  setLoanData((prevData) => ({
    ...prevData,
    startDate: date,
  }));
  setError(null);
};

  // --- EMI Calculation Utility ---
  const calculateEMI = (P, R, N) => {
    if (P <= 0 || R < 0 || N <= 0 || isNaN(P) || isNaN(R) || isNaN(N)) {
      return 0;
    }
    const r = R / 12 / 100;
    if (r === 0) {
      return P / N;
    }
    const emi = P * r * Math.pow((1 + r), N) / (Math.pow((1 + r), N) - 1);
    return Math.round(emi);
  };

  // --- STEP 1: Handle form submission to show preview ---
  const handleShowLoanPreview = (e) => {
    e.preventDefault();

    setSubmitSuccess(false);
    setError(null);

    // --- Frontend Validation ---
    if (!loanData.loanTypeId) { 
      setError('Please select a Loan Type.');
      toast.warn('Please select a Loan Type.');
      return;
    }
    if (!loanData.startDate) {
        setError('Please select a start date.');
        toast.warn('Please select a start date.');
        return;
    }
    if (!loanData.loanAmount || !loanData.duration) { 
        setError('Please fill in all required fields (Loan Amount and Duration).');
        toast.warn('Please fill in all required fields (Loan Amount and Duration).');
        return;
    }
    const loanAmt = parseFloat(loanData.loanAmount);
    const intRate = parseFloat(loanData.interestRate);
    const dur = parseInt(loanData.duration);

    if (isNaN(loanAmt) || loanAmt <= 0) {
        setError('Loan Amount must be a positive number.');
        toast.warn('Loan Amount must be a positive number.');
        return;
    }
    if (isNaN(intRate) || intRate < 0) {
        setError('Invalid Interest Rate (ensure a Loan Type is selected).');
        toast.warn('Invalid Interest Rate (ensure a Loan Type is selected).');
        return;
    }
    if (isNaN(dur) || dur <= 0) {
        setError('Duration must be a positive whole number of months.');
        toast.warn('Duration must be a positive whole number of months.');
        return;
    }

    const emi = calculateEMI(loanAmt, intRate, dur);
    setCalculatedEMI(emi);

    setSubmittedLoanDetails({
        memberId: member.memberId,
        memberName: `${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`,        loanAmount: loanAmt,
        interestRate: intRate,
        duration: dur,
        startDate: loanData.startDate,
        calculatedEMI: emi,
        loanTypeId: parseInt(loanData.loanTypeId) 
    });

    setShowPreview(true);
    toast.info('Please review loan details before confirming.');
  };

  // --- STEP 2: Handle actual API call from the preview screen ---
  const handleFinalAddLoan = async () => {
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    const loanPayload = {
      memberId: submittedLoanDetails.memberId,
      loanAmount: submittedLoanDetails.loanAmount,
      loanDate: format(submittedLoanDetails.startDate, 'yyyy-MM-dd'),
      durationMonths: submittedLoanDetails.duration,
      interestRate: submittedLoanDetails.interestRate,
      loanTypeId: submittedLoanDetails.loanTypeId, 
      loanStatus: "active"
    };

    console.log('Final Loan Payload for API submission:', loanPayload);

    try {
      const response = await addLoan(loanPayload);
      console.log('Loan added successfully:', response.data);

      setSubmitSuccess(true);
      toast.success('Loan successfully added to database!');

      setLoanData({ loanAmount: '', interestRate: '', duration: '', startDate: null, loanTypeId: '' }); 
      setCalculatedEMI(null);
      setShowPreview(false);
      setSubmittedLoanDetails(null);

    } catch (apiError) {
      console.error('Failed to add loan:', apiError);
      const errorMessage = apiError.response?.data?.message || apiError.message || 'An unexpected error occurred.';
      setError(`Failed to add loan: ${errorMessage}`);
      toast.error(`Failed to add loan: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handle "Back to Form" button from preview ---
  const handleBackFromPreview = () => {
    setShowPreview(false);
    setCalculatedEMI(null);
    setSubmittedLoanDetails(null);
    setError(null);
  };

  // --- Conditional Rendering for Loading and Critical Error States ---
  // Combine loading states for a single spinner during initial data fetch
  if (loadingMember || loadingLoanTypes) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3 text-muted">Fetching data...</p>
      </div>
    );
  }

  if (error && !submitSuccess && !showPreview) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
        <div className="alert alert-danger text-center animate__animated animate__shakeX w-100 mx-3" style={{ maxWidth: '600px' }}>
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <strong>Error:</strong> {error}
        </div>
        <div className="mt-4 animate__animated animate__fadeInUp">
          <BackButton />
        </div>
      </div>
    );
  }

  if (!member || !member.memberId) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
        <div className="alert alert-warning text-center w-100 mx-3" style={{ maxWidth: '600px' }}>
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          Member not found or invalid ID. Please go back and select a valid member.
        </div>
        <div className="mt-4 animate__animated animate__fadeInUp">
          <BackButton />
        </div>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5 position-relative">
      <div
        className="card shadow-lg p-4 rounded-4 w-100 mx-3 animate__animated animate__fadeInUp"
        style={{ maxWidth: '700px', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}
      >
        <div className="text-center mb-4 border-bottom pb-3">
          <i className="bi bi-cash-stack display-4 text-info mb-2 animate__animated animate__bounceIn"></i>
          <h3 className="fw-bold text-info mb-2">Add New Loan</h3>
          <p className="text-muted fs-6">
            For: <span className="fw-bold text-primary text-capitalize">
              {member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName}
            </span> (Member ID: {member.memberId})
          </p>
        </div>

        {submitSuccess ? (
          <div className="alert alert-success text-center animate__animated animate__bounceIn mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2 fs-5"></i> Loan successfully added!
            <hr />
            {submittedLoanDetails && (
                <>
                    <p className="mb-1"><strong>Member:</strong> {submittedLoanDetails.memberName}</p>
                    <p className="mb-1"><strong>Loan Type:</strong> {loanTypes.find(t => t.loanTypeId === submittedLoanDetails.loanTypeId)?.typeName || 'N/A'}</p>
                    <p className="mb-1"><strong>Amount:</strong> ₹{submittedLoanDetails.loanAmount?.toFixed(2)}</p>
                    <p className="mb-1"><strong>Interest Rate:</strong> {submittedLoanDetails.interestRate}%</p>
                    <p className="mb-1"><strong>Duration:</strong> {submittedLoanDetails.duration} months</p>
                    <p className="mb-1">
                      <strong>Start Date:</strong>{' '}
                      {submittedLoanDetails.startDate ? format(submittedLoanDetails.startDate, 'dd/MM/yyyy') : 'N/A'}
                    </p>
                    <p className="mb-0"><strong>Calculated EMI:</strong> ₹{calculatedEMI?.toFixed(2)}</p>
                </>
            )}
            <div className="mt-3">
              <button
               className="btn btn-outline-success btn-md rounded-pill px-3"
                onClick={() => navigate('/select-member-loan')}
                 >
                <i className="bi bi-plus-circle me-2"></i> Add Another Loan
              </button>

              <button className="btn btn-outline-secondary btn-md rounded-pill px-3 ms-2" onClick={() => navigate('/dashboards/admin')}>
                 <i className="bi bi-house-door me-2"></i> Go to Dashboard
              </button>
               <button className="btn btn-outline-info btn-md rounded-pill px-3 ms-2" onClick={() => navigate('/loans/active')}>
                 <i className="bi bi-list me-2"></i> View All Loans
              </button>
            </div>
          </div>
        ) : (
          <>
            {!showPreview ? (
              <form onSubmit={handleShowLoanPreview}>
                {error && (
                  <div className="alert alert-danger text-center animate__animated animate__shakeX mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                  </div>
                )}

                <div className="row g-3">
                    {/* Loan Type Select Field */}
                    <div className="col-12 mb-3">
                        <label htmlFor="loanTypeId" className="form-label fw-bold">Loan Type<span className="text-danger">*</span></label>
                        <select
                        className="form-select form-select-md"
                        id="loanTypeId"
                        name="loanTypeId"
                        value={loanData.loanTypeId}
                        onChange={handleLoanTypeChange}
                        required
                        disabled={loadingLoanTypes || loanTypes.length === 0}
                        >
                            <option value="">
                                {loadingLoanTypes ? 'Loading Loan Types...' : (loanTypes.length === 0 ? 'No Loan Types Available' : 'Select a Loan Type')}
                            </option>
                            {loanTypes.map((type) => (
                                <option key={type.loanTypeId} value={type.loanTypeId}>
                                    {type.typeName || `Loan Type ${type.loanTypeId}`} ({type.interestRate}%)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loan Amount */}
                    <div className="col-12 mb-3">
                        <label htmlFor="loanAmount" className="form-label fw-bold">Loan Amount (₹)<span className="text-danger">*</span></label>
                        <input
                        type="number"
                        className="form-control form-control-md"
                        id="loanAmount"
                        name="loanAmount"
                        value={loanData.loanAmount}
                        onChange={handleChange}
                        placeholder="e.g., 5000.00"
                        required
                        min="0.01"
                        step="0.01"
                        />
                    </div>
                    {/* Interest Rate - Now a disabled input, populated from selection */}
                    <div className="col-12 mb-3">
                        <label htmlFor="interestRate" className="form-label fw-bold">Interest Rate (%)<span className="text-danger">*</span></label>
                        <input
                        type="text" // Keep as text, as it's disabled and populated
                        className="form-control form-control-md"
                        id="interestRate"
                        name="interestRate"
                        value={loanData.interestRate}
                        disabled // This should be disabled as it's set by loan type
                        placeholder="Select Loan Type Above"
                        />
                    </div>
                    {/* Duration */}
                    <div className="col-12 mb-3">
                        <label htmlFor="duration" className="form-label fw-bold">Duration (months)<span className="text-danger">*</span></label>
                        <input
                        type="number"
                        className="form-control form-control-md"
                        id="duration"
                        name="duration"
                        value={loanData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 12"
                        required
                        min="1"
                        />
                    </div>
                    {/* Start Date */}
                    <div className="col-12 mb-3">
                        <label htmlFor="startDate" className="form-label fw-bold">Start Date<span className="text-danger">*</span></label>
                        <DatePicker
                            selected={loanData.startDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            className="form-control form-control-md"
                            id="startDate"
                            name="startDate"
                            placeholderText="DD/MM/YYYY"
                            required
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={15}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-info btn-md rounded-pill px-4 animate__animated animate__pulse"
                    disabled={!member.memberId || isSubmitting || loadingLoanTypes || loanTypes.length === 0}
                  >
                    <i className="bi bi-eye-fill me-2"></i> Preview Loan Details
                  </button>
                </div>
              </form>
            ) : (
              <div className="card p-4 shadow-sm mt-3 animate__animated animate__fadeIn">
                <h4 className="text-center mb-4">Confirm Loan Details</h4>
                {error && (
                  <div className="alert alert-danger text-center animate__animated animate__shakeX mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                  </div>
                )}
                {submittedLoanDetails && (
                  <>
                    <p><strong>Member:</strong> {submittedLoanDetails.memberName}</p>
                    <p><strong>Amount:</strong> ₹{submittedLoanDetails.loanAmount?.toFixed(2)}</p>
                    <p><strong>Interest Rate:</strong> {submittedLoanDetails.interestRate}%</p>
                    <p><strong>Duration:</strong> {submittedLoanDetails.duration} months</p>
                    <p>
                      <strong>Start Date:</strong>{' '}
                      {submittedLoanDetails.startDate ? format(submittedLoanDetails.startDate, 'dd/MM/yyyy') : 'N/A'}
                    </p>
                    <p className="mb-0"><strong>Calculated EMI:</strong> ₹{calculatedEMI?.toFixed(2)}</p>
                  </>
                )}

                <div className="mt-4 d-flex justify-content-center">
                  <button
                    className="btn btn-info btn-md me-3 rounded-pill px-4"
                    onClick={handleFinalAddLoan}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i> Confirm & Add Loan
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary btn-md rounded-pill px-4"
                    onClick={handleBackFromPreview}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-arrow-left-circle-fill me-2"></i> Back to Form
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {!submitSuccess && (
        <div className="mt-4 animate__animated animate__fadeInUp">
          <BackButton />
        </div>
      )}
    </div>
  );
};

export default AddLoanForm;