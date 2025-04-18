import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  baseURL: "http://localhost:5000/",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set Authorization header
const setAuthToken = (token) => {
  if (token) {
    // console.log(token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Add request interceptor to automatically add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage on each request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 error - redirect to login
    if (error.response && error.response.status === 401) {
      console.log('Session expired or unauthorized. Redirecting to login...');
      // You can dispatch a logout action here if needed
      // For now, we'll just log the error
    }
    return Promise.reject(error);
  }
);

// Initialize token from localStorage when the app loads
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export { axiosInstance, setAuthToken };
