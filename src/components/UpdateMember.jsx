import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMemberById, updateMember } from '../services/memberService';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateMember = () => {
  const { id } = useParams(); // Get member ID from the URL
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
    password: '', // Add password field
  });
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await updateMember(id, member); // Update member details
      navigate('/view-members'); // Redirect to the members list
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Update Member</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      
      <div className="card shadow-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={member.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Middle Name</label>
              <input
                type="text"
                className="form-control"
                name="middleName"
                value={member.middleName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={member.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={member.dob}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                name="gender"
                value={member.gender}
                onChange={handleInputChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Marital Status</label>
              <select
                className="form-control"
                name="maritalStatus"
                value={member.maritalStatus}
                onChange={handleInputChange}
                required
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

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

            <div className="mb-3">
              <label className="form-label">Contact No</label>
              <input
                type="text"
                className="form-control"
                name="contactNo"
                value={member.contactNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={member.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={member.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">PAN Card No</label>
              <input
                type="text"
                className="form-control"
                name="panCardNo"
                value={member.panCardNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Aadhar No</label>
              <input
                type="text"
                className="form-control"
                name="aadharNo"
                value={member.aadharNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nominee Name</label>
              <input
                type="text"
                className="form-control"
                name="nomineeName"
                value={member.nomineeName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nominee Relation</label>
              <input
                type="text"
                className="form-control"
                name="nomineeRelation"
                value={member.nomineeRelation}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                name="role"
                value={member.role}
                onChange={handleInputChange}
                required
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Password (Leave empty to keep existing)</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={member.password}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMember;
