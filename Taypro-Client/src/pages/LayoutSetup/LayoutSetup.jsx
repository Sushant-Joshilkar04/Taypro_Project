import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createLayout, updateLayoutAsync, fetchLayout } from "../../store/slices/layoutSlice";
import GridEditor from "../../components/GridEditor";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const LayoutSetup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const existingLayouts = useSelector(state => state.layout.layouts);
    const isLoading = useSelector(state => state.layout.isLoading);
    const error = useSelector(state => state.layout.error);
    
    const initialLayout = location.state?.layout;
    const mode = initialLayout ? "update" : "create";

    // States
    const [layoutName, setLayoutName] = useState(initialLayout?.name || "");
    const [grids, setGrids] = useState(initialLayout?.grids ? [...initialLayout.grids] : []);
    const [activeGridIndex, setActiveGridIndex] = useState(0);
    
    // Grid configuration states
    const [gridCount, setGridCount] = useState(1);
    const [sameSize, setSameSize] = useState(true);
    const [newGridRows, setNewGridRows] = useState(5);
    const [newGridCols, setNewGridCols] = useState(5);
    const [newGridLabel, setNewGridLabel] = useState("Main Area");

    // Handle API errors
    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'An error occurred');
        }
    }, [error]);

    // Initialize with a first grid if creating new layout
    useEffect(() => {
        if (mode === "create" && grids.length === 0) {
            handleAddGrid();
        }
    }, []);

    // Add a new grid to the configuration
    const handleAddGrid = () => {
        // Create default grid data
        const gridLabel = newGridLabel.trim() === "" ? `Grid ${grids.length + 1}` : newGridLabel;
        
        const newGrid = {
            id: Date.now().toString(),
            label: gridLabel,
            rows: newGridRows,
            cols: newGridCols,
            layout: Array.from({ length: newGridRows }, () =>
                Array.from({ length: newGridCols }, () => 0)
            )
        };

        // If same size is selected, adjust all grids to match the new size
        if (sameSize && grids.length > 0) {
            const updatedGrids = grids.map(grid => ({
                ...grid,
                rows: newGridRows,
                cols: newGridCols,
                layout: resizeGrid(grid.layout, grid.rows, grid.cols, newGridRows, newGridCols)
            }));
            setGrids([...updatedGrids, newGrid]);
        } else {
            setGrids([...grids, newGrid]);
        }

        // Set the new grid as active
        setActiveGridIndex(grids.length);
        
        // Reset the new grid label
        setNewGridLabel("");
    };

    // Resize a grid's layout while preserving existing cell values
    const resizeGrid = (oldLayout, oldRows, oldCols, newRows, newCols) => {
        const newLayout = Array.from({ length: newRows }, () =>
            Array.from({ length: newCols }, () => 0)
        );

        // Copy values from old layout to new layout (only for cells that exist in both)
        for (let i = 0; i < Math.min(oldRows, newRows); i++) {
            for (let j = 0; j < Math.min(oldCols, newCols); j++) {
                newLayout[i][j] = oldLayout[i][j];
            }
        }

        return newLayout;
    };

    // Update a specific grid's layout
    const handleGridLayoutUpdate = (newLayout) => {
        const updatedGrids = [...grids];
        updatedGrids[activeGridIndex] = {
            ...updatedGrids[activeGridIndex],
            layout: newLayout
        };
        setGrids(updatedGrids);
    };

    // Remove a grid from the configuration
    const handleRemoveGrid = (index) => {
        if (grids.length <= 1) {
            toast.error("You must have at least one grid");
            return;
        }

        const updatedGrids = grids.filter((_, i) => i !== index);
        setGrids(updatedGrids);
        
        // Adjust active grid index if the removed grid was active or before it
        if (activeGridIndex >= index) {
            setActiveGridIndex(Math.max(0, activeGridIndex - 1));
        }
    };

    // Handle size option change
    const handleSizeOptionChange = (useSameSize) => {
        setSameSize(useSameSize);
        
        // If switching to same size, resize all grids to match the first grid
        if (useSameSize && grids.length > 1) {
            const firstGrid = grids[0];
            const updatedGrids = grids.map((grid, index) => {
                if (index === 0) return grid; // Don't resize the first grid
                
                return {
                    ...grid,
                    rows: firstGrid.rows,
                    cols: firstGrid.cols,
                    layout: resizeGrid(grid.layout, grid.rows, grid.cols, firstGrid.rows, firstGrid.cols)
                };
            });
            
            setGrids(updatedGrids);
            setNewGridRows(firstGrid.rows);
            setNewGridCols(firstGrid.cols);
        }
    };

    // Fill all grids with panels
    const fillAllGridsWithPanels = () => {
        const updatedGrids = grids.map(grid => {
            // Create a layout filled with 1s (panels)
            const filledLayout = Array.from({ length: grid.rows }, () =>
                Array.from({ length: grid.cols }, () => 1)
            );
            
            return {
                ...grid,
                layout: filledLayout
            };
        });
        
        setGrids(updatedGrids);
    };

    // Add multiple grids at once
    const handleAddMultipleGrids = () => {
        // Create specified number of grids
        const newGrids = [];
        
        // Don't add any grids if gridCount is 0
        if (gridCount <= 0) return;
        
        for (let i = 0; i < gridCount; i++) {
            const gridLabel = `Grid ${grids.length + i + 1}`;
            
            // Default grid with all cells filled with panels (value 1)
            const newGrid = {
                id: Date.now().toString() + i,
                label: gridLabel,
                rows: newGridRows,
                cols: newGridCols,
                layout: Array.from({ length: newGridRows }, () =>
                    Array.from({ length: newGridCols }, () => 1)
                )
            };
            
            newGrids.push(newGrid);
        }
        
        setGrids([...grids, ...newGrids]);
        
        // Set the first new grid as active
        setActiveGridIndex(grids.length);
    };

    // Save the entire layout configuration
    const handleSaveLayout = () => {
        if (layoutName.trim() === "") {
            toast.error("Please enter a layout name");
            return;
        }

        if (grids.length === 0) {
            toast.error("Please add at least one grid");
            return;
        }

        // Check if layout name already exists (for create mode)
        if (mode === "create" && existingLayouts.some(l => l.name.toLowerCase() === layoutName.trim().toLowerCase())) {
            toast.error("Layout name already exists. Please choose a different name.");
            return;
        }

        // Check that all grids have valid labels
        const gridsWithDefaultLabels = grids.map((grid, index) => {
            // If label is missing or empty, provide a default one
            if (!grid.label || grid.label.trim() === "") {
                return {
                    ...grid,
                    label: `Grid ${index + 1}`
                };
            }
            return grid;
        });

        // Prepare layout data
        const layoutData = {
            name: layoutName,
            grids: gridsWithDefaultLabels.map(grid => ({
                label: grid.label,
                rows: grid.rows,
                cols: grid.cols,
                layout: grid.layout
            })),
            createdAt: new Date().toISOString()
        };

        // Dispatch action based on mode
        if (mode === "create") {
            dispatch(createLayout(layoutData))
                .unwrap()
                .then(() => {
                    toast.success("Layout created successfully");
                    navigate("/user/dashboard");
                })
                .catch((err) => {
                    toast.error(err?.message || "Failed to create layout");
                });
        } else {
            dispatch(updateLayoutAsync({ 
                layoutId: initialLayout._id,
                layoutData: {
                    ...layoutData,
                    _id: initialLayout._id
                }
            }))
                .unwrap()
                .then(() => {
                    toast.success("Layout updated successfully");
                    navigate("/user/dashboard");
                })
                .catch((err) => {
                    toast.error(err?.message || "Failed to update layout");
                });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-green-50 py-8 px-4">
            <h1 className="text-2xl font-bold text-green-800 mb-6">
                {mode === "create" ? "Create New Layout" : "Update Layout"}
            </h1>

            {/* Main layout configuration */}
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Layout Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={layoutName}
                        onChange={(e) => setLayoutName(e.target.value)}
                        placeholder="Enter a name for this layout"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Grid Configuration</label>
                    <div className="flex items-center mb-4">
                        <label className="inline-flex items-center mr-6">
                            <input
                                type="radio"
                                className="form-radio text-green-500"
                                name="gridSizeType"
                                checked={sameSize}
                                onChange={() => handleSizeOptionChange(true)}
                            />
                            <span className="ml-2">Same size for all grids</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-green-500"
                                name="gridSizeType"
                                checked={!sameSize}
                                onChange={() => handleSizeOptionChange(false)}
                            />
                            <span className="ml-2">Different sizes for each grid</span>
                        </label>
                    </div>
                    
                    {sameSize && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Number of Grids</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={gridCount}
                                        onChange={(e) => setGridCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max="10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Rows</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={newGridRows}
                                        onChange={(e) => setNewGridRows(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max="20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Columns</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={newGridCols}
                                        onChange={(e) => setNewGridCols(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max="20"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="w-full bg-green-500 text-white px-4 py-2 rounded"
                                        onClick={handleAddMultipleGrids}
                                    >
                                        Create Grids
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={fillAllGridsWithPanels}
                                    >
                                        Fill All with Panels
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid tabs */}
                {grids.length > 0 && (
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex flex-wrap -mb-px">
                                {grids.map((grid, index) => (
                                    <button
                                        key={grid.id || index}
                                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                            activeGridIndex === index
                                                ? "border-green-500 text-green-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                        onClick={() => setActiveGridIndex(index)}
                                    >
                                        {sameSize ? `Grid ${index + 1}` : (grid.label || `Grid ${index + 1}`)}
                                        {grids.length > 1 && (
                                            <FiTrash2 
                                                className="ml-2 inline-block text-red-500 hover:text-red-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveGrid(index);
                                                }}
                                            />
                                        )}
                                    </button>
                                ))}
                                {!sameSize && (
                                    <button
                                        className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                                        onClick={() => setNewGridLabel("Main Area")}
                                    >
                                        <FiPlus className="inline-block mr-1" /> Add Grid
                                    </button>
                                )}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Add new grid form - only show in different sizes mode */}
                {!sameSize && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Grid</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Grid Label</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={newGridLabel}
                                    onChange={(e) => setNewGridLabel(e.target.value)}
                                    placeholder="Living Room, Kitchen, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Rows</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={newGridRows}
                                    onChange={(e) => setNewGridRows(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max="20"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Columns</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={newGridCols}
                                    onChange={(e) => setNewGridCols(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max="20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                                onClick={() => setNewGridLabel("Main Area")}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddGrid}
                            >
                                Add Grid
                            </button>
                        </div>
                    </div>
                )}

                {/* Active grid editor */}
                {grids.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Grid: {grids[activeGridIndex].label || `Grid ${activeGridIndex + 1}`}</h3>
                        
                        {!sameSize && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Rows</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={grids[activeGridIndex].rows}
                                        onChange={(e) => {
                                            const newRows = parseInt(e.target.value) || 1;
                                            const updatedGrids = [...grids];
                                            updatedGrids[activeGridIndex] = {
                                                ...updatedGrids[activeGridIndex],
                                                rows: newRows,
                                                layout: resizeGrid(
                                                    updatedGrids[activeGridIndex].layout,
                                                    updatedGrids[activeGridIndex].rows,
                                                    updatedGrids[activeGridIndex].cols,
                                                    newRows,
                                                    updatedGrids[activeGridIndex].cols
                                                )
                                            };
                                            setGrids(updatedGrids);
                                        }}
                                        min="1"
                                        max="20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Columns</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={grids[activeGridIndex].cols}
                                        onChange={(e) => {
                                            const newCols = parseInt(e.target.value) || 1;
                                            const updatedGrids = [...grids];
                                            updatedGrids[activeGridIndex] = {
                                                ...updatedGrids[activeGridIndex],
                                                cols: newCols,
                                                layout: resizeGrid(
                                                    updatedGrids[activeGridIndex].layout,
                                                    updatedGrids[activeGridIndex].rows,
                                                    updatedGrids[activeGridIndex].cols,
                                                    updatedGrids[activeGridIndex].rows,
                                                    newCols
                                                )
                                            };
                                            setGrids(updatedGrids);
                                        }}
                                        min="1"
                                        max="20"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <GridEditor
                            mode="edit"
                            gridData={grids[activeGridIndex]}
                            onLayoutUpdate={handleGridLayoutUpdate}
                        />
                    </div>
                )}

                {/* Save and Cancel buttons */}
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                        onClick={() => navigate('/user/dashboard')}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`bg-green-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={handleSaveLayout}
                        disabled={isLoading || grids.length === 0 || !layoutName.trim()}
                    >
                        {isLoading ? 'Saving...' : (mode === "create" ? "Save Layout" : "Update Layout")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LayoutSetup;
