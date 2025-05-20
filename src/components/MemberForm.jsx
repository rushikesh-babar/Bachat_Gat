import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMember } from '../services/memberService'; // Adjust path if needed

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
    password: ''
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
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.middleName) newErrors.middleName = 'Middle name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.contactNo) newErrors.contactNo = 'Contact number is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.panCardNo) newErrors.panCardNo = 'PAN number is required';
    if (!formData.aadharNo) newErrors.aadharNo = 'Aadhar number is required';
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
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Add New Member</h3>
        </div>
        <div className="card-body">
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Middle Name*</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.middleName && <div className="text-danger">{errors.middleName}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Date of Birth*</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.dob && <div className="text-danger">{errors.dob}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Marital Status</label>
                <input
                  type="text"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Contact Number*</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.contactNo && <div className="text-danger">{errors.contactNo}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">PAN Card No*</label>
                <input
                  type="text"
                  name="panCardNo"
                  value={formData.panCardNo}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.panCardNo && <div className="text-danger">{errors.panCardNo}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Aadhar No*</label>
                <input
                  type="text"
                  name="aadharNo"
                  value={formData.aadharNo}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.aadharNo && <div className="text-danger">{errors.aadharNo}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Nominee Name</label>
                <input
                  type="text"
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nominee Relation</label>
                <input
                  type="text"
                  name="nomineeRelation"
                  value={formData.nomineeRelation}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Role*</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
                {errors.role && <div className="text-danger">{errors.role}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
