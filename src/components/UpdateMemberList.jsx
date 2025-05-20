import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMembers } from '../services/memberService';

const UpdateMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);  // State to handle loading
  const [error, setError] = useState(null);  // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const data = await fetchMembers();  // Fetch members once when the component mounts
        console.log(data); // Log to verify the data structure
        setMembers(data);
        setLoading(false);  // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching members:', error);
        setError(error.message || 'An error occurred while fetching members');
        setLoading(false);
      }
    };

    fetchMembersData();  // Calling fetchMembersData on component mount
  }, []);  // Empty dependency array to run only on mount

  if (loading) {
    return <div>Loading members...</div>;  // Loading state
  }

  if (error) {
    return <div className="text-danger">{error}</div>;  // Error state
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Select Member to Update</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
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
                      onClick={() => navigate(`/update-member/${member.memberId}`)}  
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
    </div>
  );
};

export default UpdateMemberList;
