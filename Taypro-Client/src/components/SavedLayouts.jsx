import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLayoutAsync, fetchLayouts } from "../store/slices/layoutSlice";
import { useNavigate } from "react-router-dom";

const SavedLayouts = () => {
    const layoutState = useSelector((state) => state.layout);
    const layouts = Array.isArray(layoutState.layouts) ? layoutState.layouts : [];
    const isLoading = useSelector((state) => state.layout.isLoading);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch layouts when component mounts
    useEffect(() => {
        dispatch(fetchLayouts());
    }, [dispatch]);

    // For logging layout structure to debug
    useEffect(() => {
        if (layouts && layouts.length > 0) {
            console.log("Layout structure example:", layouts[0]);
        }
    }, [layouts]);

    // State for confirmation popup
    const [showPopup, setShowPopup] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState(null);

    // Handle Edit Button Click
    const handleEdit = (layout) => {
        console.log("Editing layout:", layout);
        navigate("/user/layout-edit", {
            state: {
                layout: layout
            },
        });
    };

    // Get the MongoDB _id from the layout object
    const getLayoutId = (layout) => {
        // MongoDB stores the ID as _id
        return layout._id;
    };

    // Handle Delete Confirmation
    const handleDelete = (layout) => {
        // Store the entire layout object for logging/debugging
        console.log("Deleting layout:", layout);
        const layoutId = getLayoutId(layout);
        console.log("Layout ID for deletion:", layoutId);
        
        setSelectedLayout(layoutId);
        setShowPopup(true); // Show confirmation popup
    };

    const confirmDelete = () => {
        // Dispatch delete action if confirmed
        if (selectedLayout) {
            console.log("Confirming delete with ID:", selectedLayout);
            
            dispatch(deleteLayoutAsync(selectedLayout))
                .unwrap()
                .then(() => {
                    console.log("Layout deleted successfully");
                    setShowPopup(false);
                    setSelectedLayout(null);
                    // Refresh layouts after deletion
                    dispatch(fetchLayouts());
                })
                .catch((err) => {
                    console.error("Error deleting layout:", err);
                    // Still close popup even if delete fails
                    setShowPopup(false);
                    setSelectedLayout(null);
                });
        }
    };

    const cancelDelete = () => {
        setSelectedLayout(null);
        setShowPopup(false); // Close popup without deleting
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl p-4">
                <h2 className="text-lg font-bold mb-4">Saved Layouts</h2>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading layouts...</p>
                </div>
            </div>
        );
    }

    if (!Array.isArray(layouts)) {
        console.error("Layouts is not an array:", layouts);
        return (
            <div className="w-full max-w-4xl p-4">
                <h2 className="text-lg font-bold mb-4">Saved Layouts</h2>
                <div className="text-center py-8 bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 mb-4">There was an error loading your layouts.</p>
                    <button
                        onClick={() => dispatch(fetchLayouts())}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl p-4">
            <h2 className="text-lg font-bold mb-4">Saved Layouts</h2>
            
            {layouts.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 mb-4">You haven't created any layouts yet.</p>
                    <button
                        onClick={() => navigate("/user/layout-setup")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Create First Layout
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {layouts.map((layout) => (
                        <div key={layout._id} className="border p-4 rounded shadow-lg bg-white">
                            <h3 className="font-semibold text-lg mb-2">{layout.name}</h3>
                            <p className="text-gray-600 mb-1">Grids: {layout.grids?.length || 0}</p>
                            <p className="text-gray-600 mb-4">
                                Created: {new Date(layout.createdAt).toLocaleDateString()}
                            </p>

                            {/* Grid preview (simplified) */}
                            <div className="w-full overflow-x-auto mt-4 mb-4">
                                {layout.grids && layout.grids[0] && (
                                    <div className="bg-gray-100 p-2 rounded border">
                                        <p className="text-sm font-medium mb-2">{layout.grids[0].label}</p>
                                        <div className="grid grid-cols-5 gap-1" style={{maxWidth: "150px"}}>
                                            {Array.from({length: Math.min(15, layout.grids[0].rows * layout.grids[0].cols)}).map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-4 h-4 bg-blue-500 rounded-sm"
                                                ></div>
                                            ))}
                                        </div>
                                        {layout.grids.length > 1 && (
                                            <p className="text-xs text-gray-500 mt-1">+{layout.grids.length - 1} more grid(s)</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-4">
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(layout)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit Layout
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(layout)}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                >
                                    Delete Layout
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                        <p className="mb-4">
                            Are you sure you want to delete this layout? This action cannot be undone.
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
