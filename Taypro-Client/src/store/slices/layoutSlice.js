import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { layoutAPI } from '../../services/api';

const initialState = {
    layouts: [],
    isLoading: false,
    error: null
};

// Async thunks for API operations
export const fetchLayouts = createAsyncThunk(
    'layout/fetchLayouts',
    async (_, { rejectWithValue }) => {
        try {
            return await layoutAPI.getAllLayouts();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchLayout = createAsyncThunk(
    'layout/fetchLayout',
    async (layoutId, { rejectWithValue }) => {
        try {
            return await layoutAPI.getLayout(layoutId);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createLayout = createAsyncThunk(
    'layout/createLayout',
    async (layoutData, { rejectWithValue }) => {
        try {
            return await layoutAPI.createLayout(layoutData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateLayoutAsync = createAsyncThunk(
    'layout/updateLayoutAsync',
    async ({ layoutId, layoutData }, { rejectWithValue }) => {
        try {
            return await layoutAPI.updateLayout(layoutId, layoutData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteLayoutAsync = createAsyncThunk(
    'layout/deleteLayoutAsync',
    async (layoutId, { rejectWithValue }) => {
        try {
            console.log("Deleting layout with ID:", layoutId);
            await layoutAPI.deleteLayout(layoutId);
            return layoutId; // Return the ID for the reducer
        } catch (error) {
            console.error("Error in deleteLayoutAsync thunk:", error);
            return rejectWithValue(error);
        }
    }
);

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        // Add a new layout (local only, for temp storage)
        addLayout: (state, action) => {
            state.layouts = Array.isArray(state.layouts) ? state.layouts : [];
            const newLayout = {
                id: Date.now().toString(),
                ...action.payload
            };
            state.layouts.push(newLayout);
        },
        
        // Update an existing layout (local only)
        updateLayout: (state, action) => {
            state.layouts = Array.isArray(state.layouts) ? state.layouts : [];
            const index = state.layouts.findIndex(layout => layout.id === action.payload.id);
            if (index !== -1) {
                state.layouts[index] = action.payload;
            }
        },
        
        // Delete a layout (local only)
        deleteLayout: (state, action) => {
            state.layouts = Array.isArray(state.layouts) ? state.layouts : [];
            state.layouts = state.layouts.filter(layout => layout.id !== action.payload);
        },
        
        // Clear any errors
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchLayouts
            .addCase(fetchLayouts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLayouts.fulfilled, (state, action) => {
                state.layouts = Array.isArray(action.payload) ? action.payload : [];
                state.isLoading = false;
            })
            .addCase(fetchLayouts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch layouts';
                state.layouts = []; // Reset to empty array on error
            })
            
            // Handle createLayout
            .addCase(createLayout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createLayout.fulfilled, (state, action) => {
                state.layouts = Array.isArray(state.layouts) ? state.layouts : [];
                state.layouts.push(action.payload);
                state.isLoading = false;
            })
            .addCase(createLayout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to create layout';
            })
            
            // Handle updateLayoutAsync
            .addCase(updateLayoutAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateLayoutAsync.fulfilled, (state, action) => {
                state.layouts = Array.isArray(state.layouts) ? state.layouts : [];
                const index = state.layouts.findIndex(layout => layout._id === action.payload._id);
                if (index !== -1) {
                    state.layouts[index] = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateLayoutAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to update layout';
            })
            
            // Handle deleteLayoutAsync
            .addCase(deleteLayoutAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteLayoutAsync.fulfilled, (state, action) => {
                state.layouts = Array.isArray(state.layouts) ? state.layouts : [];
                // Filter layouts using MongoDB _id
                state.layouts = state.layouts.filter(layout => 
                    layout._id !== action.payload && layout.id !== action.payload
                );
                state.isLoading = false;
            })
            .addCase(deleteLayoutAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to delete layout';
            });
    }
});

export const { 
    addLayout, 
    updateLayout, 
    deleteLayout, 
    clearError
} = layoutSlice.actions;

export default layoutSlice.reducer; 