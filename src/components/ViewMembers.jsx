import React, { useEffect, useState } from 'react';
import { fetchMembers } from '../services/memberService';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getMembers = async () => {
      try {
        const data = await fetchMembers();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    getMembers();
  }, []);

  const handleRowClick = (memberId) => {
    navigate(`/member-details/${memberId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">All Members</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover table-bordered shadow-lg">
          <thead className="table-dark">
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Contact No</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Education</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member.memberId}
                  onClick={() => handleRowClick(member.memberId)}
                  style={{ cursor: 'pointer' }}
                  className="table-row-hover"
                >
                  <td>{member.memberId}</td>
                  <td>{member.firstName} {member.middleName} {member.lastName}</td>
                  <td>{member.contactNo}</td>
                  <td>{member.email}</td>
                  <td>{member.gender}</td>
                  <td>{member.education}</td>
                  <td>{member.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewMembers;
