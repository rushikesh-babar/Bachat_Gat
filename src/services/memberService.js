import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 👉 Add interceptor to attach token only for secured APIs
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Define exact public endpoints
  const publicUrls = ['/login'];

  // Normalize URL for comparison (ensure it starts with `/api/...`)
  const requestUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;

  const isPublic = publicUrls.includes(requestUrl);

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


// ✅ Login (public API)
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/login', { email, password });
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
// ✅ Validate JWT Token (secured)
export const validateToken = async () => {
  try {
    const response = await API.get('/validate-token');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// ✅ Add new member (secured)
export const addMember = async (formData) => {
  try {
    const response = await API.post('/add', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add member. Please try again.');
  }
};

// ✅ Fetch all members (secured)
export const fetchMembers = async () => {
  try {
    const response = await API.get('/list');
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch members.');
  }
};

// ✅ Update member (secured)
export const updateMember = async (id, memberData) => {
  try {
    const response = await API.put(`/member/update/${id}`, memberData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update member. Please try again.');
  }
};

// ✅ Fetch member by ID (secured)
export const fetchMemberById = async (id) => {
  try {
    const response = await API.get(`/member/id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch member by ID.');
  }
};
