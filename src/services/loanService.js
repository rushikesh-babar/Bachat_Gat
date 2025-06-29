// src/services/loanService.js
import axios from 'axios';

// 🔧 Create a custom axios instance
const loanAPI = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔐 Interceptor to attach token to secured loan APIs
loanAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Add loan (secured API)
export const addLoan = async (loanData) => {
  try {
    const response = await loanAPI.post('/loans/add', loanData);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to add loan. Please try again.';
    throw new Error(errMsg);
  }
};

// ✅ Fetch loan types (likely secured, using the same loanAPI instance)

export const fetchLoanTypes = async () => {
  try {
    const response = await loanAPI.get('/loans/loan-types'); // 'loan-types' will combine with baseURL '/api'
    return response.data; // axios automatically parses JSON response
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to fetch loan types. Please try again.';
    console.error('Error fetching loan types:', error.response || error);
    throw new Error(errMsg);
  }
};


export const getActiveLoans = async () => {
  try {
    const response = await loanAPI.get('/loans/active-loans');
    return response.data;
  } catch (error) {
    console.error('Error fetching active loans:', error);
    throw error;
  }
};

export const getLoanDetails = async (loanId) => {
  try {
    const response = await loanAPI.get(`/loans/active-loans/${loanId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching loan details for ${loanId}:`, error);
    throw error;
  }
};

export const closeLoan = async (loanId) => {
  try {
    const response = await loanAPI.post(`/loans/${loanId}/close`); 
    return response.data; 
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to close loan. Please try again.';
    console.error(`Error closing loan ${loanId}:`, error);
    throw new Error(errMsg);
  }
};

// 🔍 Get loan closure summary (loan details + paid EMIs + closing amount)
export const getLoanClosureSummary = async (loanId) => {
  try {
    const response = await loanAPI.get(`/loans/${loanId}/closure-summary`);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to fetch loan closure summary.';
    console.error(`Error fetching closure summary for loanId ${loanId}:`, error);
    throw new Error(errMsg);
  }
};

