import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMembers } from '../services/memberService';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';
const UpdateMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const data = await fetchMembers();
        console.log(data);
        setMembers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError(error.message || 'An error occurred while fetching members');
        setLoading(false);
      }
    };

    fetchMembersData();
  }, []);

  if (loading) {
    return <div>Loading members...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Select Member to Update</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-lg">
          <thead className="table-dark">
            <tr>
              <th>Member ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member.memberId}
                  onClick={() => navigate(`/update-member/${member.memberId}`)}
                  style={{ cursor: 'pointer' }}
                  className="table-row-hover"
                >
                  <td>{member.memberId}</td>
                  <td>{member.firstName} {member.middleName} {member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.contactNo}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/update-member/${member.memberId}`);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">No members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <BackButton />
      <LogoutButton />

      {/* Inline styles for hover effect */}
      <style>{`
        .table-row-hover:hover {
          background-color: #f0f8ff;
          text-decoration: underline;
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default UpdateMemberList;
