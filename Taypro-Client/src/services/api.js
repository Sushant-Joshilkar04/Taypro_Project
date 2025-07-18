import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'https://taypro-project.vercel.app/', // Adjust this to match your server URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
    (config) => {
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

// Layout API endpoints
export const layoutAPI = {
    // Get all layouts for the authenticated user
    getAllLayouts: async () => {
        try {
            const response = await api.get('/api/layouts');
            // Ensure response.data is an array
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching layouts:', error);
            // Return an empty array instead of throwing an error
            return [];
        }
    },

    // Get a specific layout
    getLayout: async (layoutId) => {
        try {
            console.log("Fetching layout with ID:", layoutId);
            const response = await api.get(`/api/layouts/${layoutId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching layout:", error);
            throw error.response?.data || error.message;
        }
    },

    // Create a new layout
    createLayout: async (layoutData) => {
        try {
            const response = await api.post('/api/layouts', layoutData);
            return response.data;
        } catch (error) {
            console.error("Error creating layout:", error);
            throw error.response?.data || error.message;
        }
    },

    // Update an existing layout
    updateLayout: async (layoutId, layoutData) => {
        try {
            console.log("Updating layout with ID:", layoutId);
            console.log("Update data:", layoutData);
            const response = await api.put(`/api/layouts/${layoutId}`, layoutData);
            return response.data;
        } catch (error) {
            console.error("Error updating layout:", error);
            throw error.response?.data || error.message;
        }
    },

    // Delete a layout
    deleteLayout: async (layoutId) => {
        try {
            console.log("API call - Deleting layout with ID:", layoutId);
            const response = await api.delete(`/api/layouts/${layoutId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting layout:", error, error.response);
            throw error.response?.data || error.message;
        }
    }
};

export default api; 