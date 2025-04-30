import axios from 'axios';

// API URL
const API_URL = '/api'; // Adjust the base API URL as necessary

// Function to login the user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data && response.data.token) {
      return {
        token: response.data.token, // Returning token for JWT
        role: response.data.role,   // Assuming you have a role in the response
        user: response.data.user,   // Assuming user details are returned
      };
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    // Providing a detailed error message for failed login attempt
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

// Function to add a member
export const addMember = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, formData);
    return response.data;  // Return response data (success message or data)
  } catch (error) {
    // Provide detailed error handling
    throw new Error(error.response?.data?.message || 'Failed to add member. Please try again.');
  }
};
