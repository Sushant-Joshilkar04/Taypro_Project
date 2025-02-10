import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addLayout, updateLayout } from "../store/slices/layoutSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GridEditor = ({ mode = "create", initialLayout = null }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const existingLayouts = useSelector(state => state.layout.layouts)

    // States
    const [rows, setRows] = useState(mode === "update" ? initialLayout.rows : null);
    const [cols, setCols] = useState(mode === "update" ? initialLayout.cols : null);
    const [layoutName, setLayoutName] = useState(mode === "update" ? initialLayout.name : "");
    const [grid, setGrid] = useState(
        mode === "update" ? initialLayout.layout : []
    );

    useEffect(() => {
        if (mode === "update" && initialLayout) {
            setLayoutName(initialLayout.name);
            setRows(initialLayout.rows);
            setCols(initialLayout.cols);
            setGrid(initialLayout.layout);
        }
    }, [initialLayout, mode]);

    // Generate grid when rows or columns change
    useEffect(() => {
        if (rows > 0 && cols > 0 && mode === "create") {
            const newGrid = Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => 0)
            );
            setGrid(newGrid);
        }
    }, [rows, cols, mode]);

    // Handle cell click (toggle values)
    const handleCellClick = (row, col) => {
        const newGrid = [...grid];
        newGrid[row][col] = (newGrid[row][col] + 1) % 3; // Toggle 0 -> 1 -> 2 -> 0
        setGrid(newGrid);
    };

    // Handle row click (toggle entire row)
    const handleRowClick = (rowIndex) => {
        const newGrid = [...grid];
        newGrid[rowIndex] = newGrid[rowIndex].map((cell) => (cell + 1) % 3);
        setGrid(newGrid);
    };

    // Save Layout
    const handleSave = () => {

        if (mode === "create") {

            if (layoutName.trim() === "") {
                alert("Please enter a layout name.");
                return;
            }
            if (rows === null || cols === null || rows <= 0 || cols <= 0) {
                alert("Please enter rows and columns count.");
                return;
            }

            // Check if the layout name already exists
            const nameExists = existingLayouts.some(
                (layout) => layout.name.toLowerCase() === layoutName.trim().toLowerCase()
            );

            if (nameExists) {
                alert("A layout with this name already exists. Please choose a different name.");
                return;
            }

            dispatch(addLayout({ name: layoutName, rows, cols, layout: grid }));
        }

        if (mode === "update") {
            dispatch(updateLayout({ name: layoutName, rows, cols, layout: grid }));
        }

        toast.success("Layout saved successfully!", {
            className: 'text-l'
        });
        navigate("/dashboard");
    };

    // Reset Grid
    const handleReset = () => {
        if (mode === "create") {
            setRows(0);
            setCols(0);
            setLayoutName("");
            setGrid([]);
        } else {
            setGrid(initialLayout.layout); // Reset to initial layout if updating
        }
    };

    return (
        <div className="flex flex-col items-center p-8 space-y-8">
            <h2 className="text-xl font-bold">
                {mode === "create" ? "Create New Layout" : "Update Layout"}
            </h2>


            {mode === "create" && (
                <div className="flex items-center space-x-4">
                    {/* Layout Name */}
                    <label className="font-bold">Layout Name:</label>
                    <input
                        type="text"
                        value={layoutName}
                        onChange={(e) => setLayoutName(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                        disabled={mode === "update"} // Disable name edit in update mode
                    />

                    {/* Row and Column Inputs */}
                    <label className="font-bold">Rows:</label>
                    <input
                        type="number"
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded"
                        placeholder="Rows"
                    />
                    <label className="font-bold">Columns:</label>
                    <input
                        type="number"
                        value={cols}
                        onChange={(e) => setCols(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded"
                        placeholder="Cols"
                    />
                </div>
            )}

            {mode === "update" && (
                <div className="w-full px-12 flex justify-start items-start">
                    <h3 className="font-semibold text-lg mb-2">{layoutName}</h3>
                </div>
            )}

            {/* Grid Display */}
            <div className="w-full max-w-7xl overflow-x-auto">
                {/* Column Numbers */}
                <div className="flex mb-2">
                    <div className="w-8 h-8 flex-shrink-0"></div>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <div
                            key={`col-${colIndex}`}
                            className="w-8 h-8 flex-shrink-0 flex justify-center items-center text-sm font-bold border"
                        >
                            {colIndex + 1}
                        </div>
                    ))}
                </div>

                {/* Grid Rows */}
                <div>
                    {grid.map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex mb-2">
                            {/* Row Number */}
                            <div
                                className="w-8 h-16 flex-shrink-0 flex justify-center items-center text-sm font-bold border cursor-pointer"
                                onClick={() => handleRowClick(rowIndex)} // Toggle row
                            >
                                {rowIndex + 1}
                            </div>
                            {/* Cells */}
                            {row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-8 h-16 flex-shrink-0 border cursor-pointer ${cell === 0
                                        ? "bg-gray-300"
                                        : cell === 1
                                            ? "bg-blue-500"
                                            : "bg-purple-500"
                                        }`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {mode === "create" ? "Save Layout" : "Update Layout"}
                </button>
                <button
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default GridEditor;
