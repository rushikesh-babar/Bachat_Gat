import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // consistent base URL

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Function to login the user (no auth header needed here)
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data && response.data.token) {
      return {
        token: response.data.token,
        role: response.data.role,
        user: response.data.user,
      };
    } else {
      throw new Error('Invalid response from server. Token not found.');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
  }
};

// ✅ Add new member (Admin only, secured)
export const addMember = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, formData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add member. Please try again.');
  }
};

// ✅ Fetch all members (Admin or Member, secured)
export const fetchMembers = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch members.');
  }
};

// ✅ Update member (Admin only, secured)
export const updateMember = async (id, memberData) => {
  try {
    const response = await axios.put(`${API_URL}/member/update/${id}`, memberData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update member. Please try again.');
  }
};

// ✅ Fetch member by ID (secured)
export const fetchMemberById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/member/id/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch member by ID.');
  }
};
