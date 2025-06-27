// src/services/emiService.js
import axios from 'axios';

const emiAPI = axios.create({
  baseURL: '/api/emis',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Attach token for secured APIs
emiAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Fetch paid EMIs
export const fetchPaidEmis = async (month, year) => {
  try {
    const response = await emiAPI.get(`/paid?month=${month}&year=${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching paid EMIs:', error);
    throw new Error('Unable to fetch paid EMIs.');
  }
};

// ✅ Fetch pending EMIs
export const fetchPendingEmis = async (month, year) => {
  try {
    const response = await emiAPI.get(`/pending?month=${month}&year=${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending EMIs:', error);
    throw new Error('Unable to fetch pending EMIs.');
  }
};

// ✅ Pay EMI
export const payEmi = async (emiData) => {
  try {
    const response = await emiAPI.post('/pay', emiData);
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Failed to pay EMI.';
    throw new Error(errMsg);
  }
};
