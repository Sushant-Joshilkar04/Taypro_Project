import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, setAuthToken } from '../../utils/axiosConfig';

const initialState = {
    userInfo: null,
    status: 'idle',
    error: null,
};

// Async thunk to fetch user info from backend
export const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (_, { rejectWithValue }) => {
    try {
        // console.log('Fetching user info...');
        const token = localStorage.getItem('token');
        // console.log('Token from localStorage:', token);

        setAuthToken(token);
        // console.log('Token set in auth header');

        const response = await axiosInstance.get('/auth/me');
        // console.log(response.data);

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        return rejectWithValue(errorMessage);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('token'); // Clear token from localStorage
            setAuthToken(null); // Clear token from axios headers
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
