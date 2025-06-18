import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMemberById, updateMember } from '../services/memberService';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';

const UpdateMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState({
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
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const memberData = await fetchMemberById(id);
        setMember(memberData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMemberDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^\S+@\S+\.\S+$/;
    const mobilePattern = /^[0-9]{10}$/;
    const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const aadharPattern = /^\d{12}$/;

    if (!member.firstName) newErrors.firstName = 'First name is required';
    if (!member.middleName) newErrors.middleName = 'Middle name is required';
    if (!member.lastName) newErrors.lastName = 'Last name is required';

    if (!member.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (!dobPattern.test(member.dob)) {
      newErrors.dob = 'Date must be in dd/mm/yyyy format';
    }

    if (!member.contactNo) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!mobilePattern.test(member.contactNo)) {
      newErrors.contactNo = 'Contact number must be 10 digits';
    }

    if (!member.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(member.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!member.panCardNo) {
      newErrors.panCardNo = 'PAN number is required';
    } else if (!panPattern.test(member.panCardNo.toUpperCase())) {
      newErrors.panCardNo = 'PAN must be 10 characters (e.g., ABCDE1234F)';
    }

    if (!member.aadharNo) {
      newErrors.aadharNo = 'Aadhar number is required';
    } else if (!aadharPattern.test(member.aadharNo)) {
      newErrors.aadharNo = 'Aadhar number must be exactly 12 digits';
    }

    // Password is optional on update, but if entered, min 6 chars
    if (member.password && member.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!member.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      // If password field empty, do not send password to update
      const updatedMember = { ...member };
      if (!updatedMember.password) {
        delete updatedMember.password;
      }

      await updateMember(id, updatedMember);
      navigate('/view-members');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      {/* Header with Logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 text-center">
          <h2 className="text-primary">Update Member</h2>
        </div>
        <div className="ms-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Update Form */}
      <div className="card shadow-lg p-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                name="firstName"
                value={member.firstName}
                onChange={handleInputChange}
                required
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>

            {/* Middle Name */}
            <div className="mb-3">
              <label className="form-label">Middle Name</label>
              <input
                type="text"
                className={`form-control ${errors.middleName ? 'is-invalid' : ''}`}
                name="middleName"
                value={member.middleName}
                onChange={handleInputChange}
              />
              {errors.middleName && <div className="invalid-feedback">{errors.middleName}</div>}
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                name="lastName"
                value={member.lastName}
                onChange={handleInputChange}
                required
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>

            {/* Date of Birth */}
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="text"
                className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                name="dob"
                placeholder="dd/mm/yyyy"
                value={member.dob}
                onChange={handleInputChange}
                required
              />
              {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                name="gender"
                value={member.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Marital Status */}
            <div className="mb-3">
              <label className="form-label">Marital Status</label>
              <select
                className="form-control"
                name="maritalStatus"
                value={member.maritalStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            {/* Education */}
            <div className="mb-3">
              <label className="form-label">Education</label>
              <input
                type="text"
                className="form-control"
                name="education"
                value={member.education}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Contact No */}
            <div className="mb-3">
              <label className="form-label">Contact No</label>
              <input
                type="text"
                className={`form-control ${errors.contactNo ? 'is-invalid' : ''}`}
                name="contactNo"
                value={member.contactNo}
                onChange={handleInputChange}
                required
              />
              {errors.contactNo && <div className="invalid-feedback">{errors.contactNo}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                value={member.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                name="address"
                value={member.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* PAN Card No */}
            <div className="mb-3">
              <label className="form-label">PAN Card No</label>
              <input
                type="text"
                className={`form-control ${errors.panCardNo ? 'is-invalid' : ''}`}
                name="panCardNo"
                value={member.panCardNo}
                onChange={handleInputChange}
                maxLength={10}
                required
              />
              {errors.panCardNo && <div className="invalid-feedback">{errors.panCardNo}</div>}
            </div>

            {/* Aadhar No */}
            <div className="mb-3">
              <label className="form-label">Aadhar No</label>
              <input
                type="text"
                className={`form-control ${errors.aadharNo ? 'is-invalid' : ''}`}
                name="aadharNo"
                value={member.aadharNo}
                onChange={handleInputChange}
                maxLength={12}
                required
              />
              {errors.aadharNo && <div className="invalid-feedback">{errors.aadharNo}</div>}
            </div>

            {/* Nominee Name */}
            <div className="mb-3">
              <label className="form-label">Nominee Name</label>
              <input
                type="text"
                className="form-control"
                name="nomineeName"
                value={member.nomineeName}
                onChange={handleInputChange}
              />
            </div>

            {/* Nominee Relation */}
            <div className="mb-3">
              <label className="form-label">Nominee Relation</label>
              <input
                type="text"
                className="form-control"
                name="nomineeRelation"
                value={member.nomineeRelation}
                onChange={handleInputChange}
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                name="role"
                value={member.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>

            {/* Password (optional for update) */}
            <div className="mb-3">
              <label className="form-label">Password (Leave blank to keep existing)</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                value={member.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Member'}
            </button>
          </form>
        </div>
      </div>
       <BackButton />
     </div>
  );
};

export default UpdateMember;
