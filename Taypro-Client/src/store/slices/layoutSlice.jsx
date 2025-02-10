// src/store/slices/layoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        layouts: [], // Array to store layouts with names and grids
    },
    reducers: {
        addLayout: (state, action) => {
            // Save a new layout with a name and grid
            state.layouts.push(action.payload);
        },
        updateLayout: (state, action) => {
            // Update an existing layout by name
            const index = state.layouts.findIndex(
                (layout) => layout.name === action.payload.name
            );
            if (index !== -1) state.layouts[index] = action.payload;
        },
        deleteLayout: (state, action) => {
            // Delete layout by name
            state.layouts = state.layouts.filter(
                (layout) => layout.name !== action.payload
            );
        },
    },
});

export const { addLayout, updateLayout, deleteLayout } = layoutSlice.actions;
export default layoutSlice.reducer;
