import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMemberById } from '../services/memberService';
import 'bootstrap/dist/css/bootstrap.min.css';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getMember = async () => {
      try {
        const data = await fetchMemberById(id);
        setMember(data);
      } catch (err) {
        setError('Failed to fetch member details.');
      }
    };

    getMember();
  }, [id]);

  if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;
  if (!member) return <div className="text-center mt-4">Loading member details...</div>;

  return (
    <div className="container d-flex flex-column min-vh-100 py-5">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">
          <i className="bi bi-person-circle me-2"></i> Member Profile
        </h2>
      </div>

      {/* Profile Table */}
      <div className="card shadow-lg rounded-4 p-4 bg-light mx-auto" style={{ maxWidth: '1000px' }}>
        <table className="table table-striped table-bordered align-middle">
          <tbody>
            <TableRow label="Member ID" value={member.memberId} />
            <TableRow label="Full Name" value={`${member.firstName} ${member.middleName} ${member.lastName}`} />
            <TableRow label="Date of Birth" value={member.dob} />
            <TableRow label="Gender" value={member.gender} />
            <TableRow label="Marital Status" value={member.maritalStatus} />
            <TableRow label="Education" value={member.education} />
            <TableRow label="Role" value={member.role} />
            <TableRow label="Contact No" value={member.contactNo} />
            <TableRow label="Email" value={member.email} />
            <TableRow label="Address" value={member.address} />
            <TableRow label="PAN Card No" value={member.panCardNo} />
            <TableRow label="Aadhar No" value={member.aadharNo} />
            <TableRow label="Nominee Name" value={member.nomineeName} />
            <TableRow label="Nominee Relation" value={member.nomineeRelation} />
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <div className="text-center mt-5">
        <button
          className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold shadow-sm"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left-circle me-2"></i>Back
        </button>
      </div>
    </div>
  );
};

// Table Row Component
const TableRow = ({ label, value }) => (
  <tr>
    <th className="bg-white text-secondary fw-bold w-25">{label}</th>
    <td className="bg-white text-dark">{value || 'N/A'}</td>
  </tr>
);

export default MemberDetails;
