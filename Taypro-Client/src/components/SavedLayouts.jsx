import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLayout } from "../store/slices/layoutSlice";
import { useNavigate } from "react-router-dom";

const SavedLayouts = () => {
    const layouts = useSelector((state) => state.layout.layouts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State for confirmation popup
    const [showPopup, setShowPopup] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState(null);

    // Handle Edit Button Click
    const handleEdit = (layout) => {
        navigate("/setup-layout", {
            state: {
                name: layout.name,
                rows: layout.rows,
                cols: layout.cols,
                layout: layout.layout,
                mode: "update", // Mode set as update
            },
        });
    };

    // Handle Delete Confirmation
    const handleDelete = (layoutName) => {
        setSelectedLayout(layoutName);
        setShowPopup(true); // Show confirmation popup
    };

    const confirmDelete = () => {
        // Dispatch delete action if confirmed
        if (selectedLayout) {
            dispatch(deleteLayout(selectedLayout));
        }
        setShowPopup(false); // Close popup after deletion
    };

    const cancelDelete = () => {
        setSelectedLayout(null);
        setShowPopup(false); // Close popup without deleting
    };

    return (
        <div className="w-full max-w-4xl p-4">
            <h2 className="text-lg font-bold mb-4">Saved Layouts</h2>
            <div className="space-y-4">
                {layouts.map((layout) => (
                    <div key={layout.name} className="border p-4 rounded shadow-lg">
                        <h3 className="font-semibold text-lg mb-2">{layout.name}</h3>
                        <p>Rows: {layout.rows}</p>
                        <p>Columns: {layout.cols}</p>

                        {/* Displaying the grid */}
                        <div className="w-full overflow-x-auto mt-4">
                            {/* Column Headers */}
                            <div className="flex mb-2">
                                <div className="w-8 h-8 flex-shrink-0"></div>
                                {Array.from({ length: layout.cols }).map((_, colIndex) => (
                                    <div
                                        key={`col-${colIndex}`}
                                        className="w-8 h-8 flex-shrink-0 flex justify-center items-center text-sm font-bold border"
                                    >
                                        {colIndex + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Rows and Grid Cells */}
                            <div>
                                {layout.layout.map((row, rowIndex) => (
                                    <div key={`row-${rowIndex}`} className="flex mb-2">
                                        <div className="w-8 h-16 flex-shrink-0 flex justify-center items-center text-sm font-bold border">
                                            {rowIndex + 1}
                                        </div>
                                        {row.map((cell, colIndex) => (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className={`w-8 h-16 flex-shrink-0 border ${cell === 0
                                                        ? "bg-gray-300"
                                                        : cell === 1
                                                            ? "bg-blue-500"
                                                            : "bg-purple-500"
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4">
                            {/* Edit Button */}
                            <button
                                onClick={() => handleEdit(layout)}
                                className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 mt-4"
                            >
                                Edit Layout
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(layout.name)}
                                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 mt-4"
                            >
                                Delete Layout
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                        <p className="mb-4">
                            Are you sure you want to delete the layout{" "}
                            <span className="font-bold">{selectedLayout}</span>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedLayouts;
