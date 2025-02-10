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
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export { axiosInstance, setAuthToken };
