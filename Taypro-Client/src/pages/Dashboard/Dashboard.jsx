import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLayouts, deleteLayoutAsync } from '../../store/slices/layoutSlice';
import { FiEdit, FiTrash2, FiPlus, FiGrid } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { layouts, isLoading, error } = useSelector(state => state.layout);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [layoutToDelete, setLayoutToDelete] = useState(null);

    // Fetch layouts on component mount
    useEffect(() => {
        dispatch(fetchLayouts());
    }, [dispatch]);

    // Handle API errors
    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'An error occurred');
        }
    }, [error]);

    // Navigate to create new layout page
    const handleCreateNew = () => {
        navigate('/user/layout-setup');
    };

    // Navigate to edit layout page
    const handleEdit = (layout) => {
        navigate('/user/layout-edit', { state: { layout } });
    };

    // Open delete confirmation modal
    const handleDeleteClick = (layout) => {
        setLayoutToDelete(layout);
        setShowConfirmDelete(true);
    };

    // Handle layout deletion
    const handleDelete = () => {
        if (layoutToDelete) {
            dispatch(deleteLayoutAsync(layoutToDelete.id))
                .unwrap()
                .then(() => {
                    toast.success('Layout deleted successfully');
                    setShowConfirmDelete(false);
                    setLayoutToDelete(null);
                })
                .catch((err) => {
                    toast.error(err?.message || 'Failed to delete layout');
                });
        }
    };

    // Cancel delete action
    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setLayoutToDelete(null);
    };

    return (
        <div className="min-h-screen bg-green-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-green-800">My Solar Panel Layouts</h1>
                    <button
                        onClick={handleCreateNew}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <FiPlus className="mr-2" /> Create New Layout
                    </button>
                </div>

                {isLoading ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your layouts...</p>
                    </div>
                ) : layouts.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <FiGrid className="mx-auto text-5xl text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Layouts Found</h2>
                        <p className="text-gray-600 mb-6">You haven't created any layouts yet.</p>
                        <button
                            onClick={handleCreateNew}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        >
                            Create Your First Layout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {layouts.map(layout => (
                            <div key={layout.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-5">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{layout.name}</h2>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Grids:</span> {layout.grids?.length || 0}
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-medium">Created:</span> {new Date(layout.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => handleEdit(layout)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                        >
                                            <FiEdit className="text-lg" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(layout)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                        >
                                            <FiTrash2 className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">
                            Are you sure you want to delete the layout "{layoutToDelete?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

export default Dashboard; 