import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMemberById } from '../services/memberService';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getMember = async () => {
      try {
        const data = await fetchMemberById(id);
        setMember(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to fetch member details.');
      }
    };

    getMember();
  }, [id]);

  if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;
  if (!member) return <div className="text-center mt-4">Loading member details...</div>;

  return (
    <div className="container d-flex flex-column min-vh-100 py-5 position-relative">
      {/* ✅ Logout button with built-in absolute styling */}
      <LogoutButton />

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
            <TableRow label="Nominee Name" value={member.nomineeName} />
            <TableRow label="Nominee Relation" value={member.nomineeRelation} />
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <div className="mt-4 mx-auto">
        <BackButton />
      </div>

      {/* Table Styling */}
      <style>{`
        th {
          width: auto !important;
          white-space: nowrap;
          background-color: #fff !important;
          color: #6c757d !important;
          font-weight: 700 !important;
        }
        td {
          background-color: #fff !important;
          color: #212529 !important;
        }
      `}</style>
    </div>
  );
};

// Table Row Component
const TableRow = ({ label, value }) => (
  <tr>
    <th>{label}</th>
    <td>{value || 'N/A'}</td>
  </tr>
);

export default MemberDetails;
