import axios from 'axios';

const API = axios.create({
  baseURL: '/savings', // <-- your actual base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token for secured requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add monthly savings
export const addMonthlyCollection = async (collectionData) => {
  try {
    const response = await API.post('/add', collectionData); 
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data || 'Failed to add collection. Please try again.';
    throw new Error(errMsg);
  }
};

// ✅ Get all collections (optional)
export const getAllCollections = async () => {
  try {
    const response = await API.get('/all'); 
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch collections.');
  }
};

export const getPaidUnpaidMembers = async (month, year) => {
  try {
	 console.log('Fetching paid/unpaid for:', month.toLowerCase(), year);
    const response = await API.get(`/paid-unpaid/${month.toLowerCase()}/${year}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch paid/unpaid members.');
  }
};

// ✅ Get memberwise collection summary
export const getMemberwiseCollectionSummary = async () => {
  try {
    const response = await API.get('/memberwise-collection'); 
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch memberwise summary.');
  }
};

export const getMonthwisePaidUnpaid = async (month, year) => {
  try {
    const response = await API.get(`/paid-unpaid/${month.toLowerCase()}/${year}`);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch monthwise data.');
  }
};



