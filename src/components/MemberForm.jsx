import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { addMember } from '../services/memberService';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';

const MemberForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    education: '',
    contactNo: '',
    email: '',
    address: '',
    panCardNo: '',
    aadharNo: '',
    nomineeName: '',
    nomineeRelation: '',
    role: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const emailPattern = /^\S+@\S+\.\S+$/;
    const mobilePattern = /^[0-9]{10}$/;
    const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const aadharPattern = /^\d{12}$/;

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.middleName) newErrors.middleName = 'Middle name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (!dobPattern.test(formData.dob)) {
      newErrors.dob = 'Date must be in dd/mm/yyyy format';
    }

    if (!formData.contactNo) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!mobilePattern.test(formData.contactNo)) {
      newErrors.contactNo = 'Contact number must be 10 digits';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.panCardNo) {
      newErrors.panCardNo = 'PAN number is required';
    } else if (!panPattern.test(formData.panCardNo.toUpperCase())) {
      newErrors.panCardNo = 'PAN must be 10 characters (e.g., ABCDE1234F)';
    }

    if (!formData.aadharNo) {
      newErrors.aadharNo = 'Aadhar number is required';
    } else if (!aadharPattern.test(formData.aadharNo)) {
      newErrors.aadharNo = 'Aadhar number must be exactly 12 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const message = await addMember(formData);
      setErrors({});
      alert(message);
      navigate('/view-members');
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: error.message,
      }));
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
<div className="container mt-5">
    <div className="row align-items-center mb-4">
      <div className="col text-center">
        <h2 className="text-primary m-0">Add New Member</h2>
      </div>
      <div className="col-auto ms-auto">
        <LogoutButton />
      </div>
    </div>

    {errors.general && (
      <div className="alert alert-danger text-center">{errors.general}</div>
    )}  
        <div className="card shadow-lg p-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label className="form-label">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.firstName && <div className="text-danger mb-3">{errors.firstName}</div>}

            <label className="form-label">Middle Name*</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.middleName && <div className="text-danger mb-3">{errors.middleName}</div>}

            <label className="form-label">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.lastName && <div className="text-danger mb-3">{errors.lastName}</div>}

            <label className="form-label">Date of Birth* (dd/mm/yyyy)</label>
            <input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="e.g., 25/12/2000"
            />
            {errors.dob && <div className="text-danger mb-3">{errors.dob}</div>}

            <label className="form-label">Gender*</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select mb-3"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            <label className="form-label">Marital Status</label>
            <input
              type="text"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-label">Education</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-label">Contact Number*</label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.contactNo && <div className="text-danger mb-3">{errors.contactNo}</div>}

            <label className="form-label">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.email && <div className="text-danger mb-3">{errors.email}</div>}

            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-label">PAN Card No*</label>
            <input
              type="text"
              name="panCardNo"
              value={formData.panCardNo}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.panCardNo && <div className="text-danger mb-3">{errors.panCardNo}</div>}

            <label className="form-label">Aadhar No*</label>
            <input
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
              className="form-control mb-3"
            />
            {errors.aadharNo && <div className="text-danger mb-3">{errors.aadharNo}</div>}

            <label className="form-label">Nominee Name</label>
            <input
              type="text"
              name="nomineeName"
              value={formData.nomineeName}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-label">Nominee Relation</label>
            <input
              type="text"
              name="nomineeRelation"
              value={formData.nomineeRelation}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-label">Role*</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select mb-3"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
            {errors.role && <div className="text-danger mb-3">{errors.role}</div>}

            <label className="form-label">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control mb-4"
            />
            {errors.password && <div className="text-danger mb-3">{errors.password}</div>}

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-success px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <BackButton />
    </div>
  );
};

export default MemberForm;
