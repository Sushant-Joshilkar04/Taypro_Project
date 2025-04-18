import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addLayout, updateLayout } from "../store/slices/layoutSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GridEditor = ({ mode = "edit", gridData = null, onLayoutUpdate = null }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const existingLayouts = useSelector(state => state.layout.layouts)

    // States
    const [grid, setGrid] = useState([]);
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);
    const [cellLegend, setCellLegend] = useState([
        { value: 0, color: "bg-gray-300", label: "Empty" },
        { value: 1, color: "bg-blue-500", label: "Solar Panel" }
    ]);

    // Initialize grid from props
    useEffect(() => {
        if (gridData) {
            setRows(gridData.rows);
            setCols(gridData.cols);
            
            // Convert any obstacle (value 2) cells to solar panels (value 1)
            let updatedLayout = gridData.layout 
                ? gridData.layout.map(row => 
                    row.map(cell => cell === 2 ? 1 : cell)
                  ) 
                : Array.from({ length: gridData.rows }, () =>
                    Array.from({ length: gridData.cols }, () => 0)
                  );
                  
            setGrid(updatedLayout);
            
            // Notify parent component of the update if callback provided
            if (onLayoutUpdate && JSON.stringify(updatedLayout) !== JSON.stringify(gridData.layout)) {
                onLayoutUpdate(updatedLayout);
            }
        }
    }, [gridData]);

    // Handle cell click (toggle between empty and panel)
    const handleCellClick = (row, col) => {
        const newGrid = [...grid];
        newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0; // Toggle between 0 and 1
        setGrid(newGrid);
        
        // Notify parent component of the update if callback provided
        if (onLayoutUpdate) {
            onLayoutUpdate(newGrid);
        }
    };

    // Handle row click (toggle entire row)
    const handleRowClick = (rowIndex) => {
        const newGrid = [...grid];
        const currentValue = newGrid[rowIndex].every(cell => cell === 1) ? 0 : 1;
        newGrid[rowIndex] = newGrid[rowIndex].map(() => currentValue);
        setGrid(newGrid);
        
        // Notify parent component of the update if callback provided
        if (onLayoutUpdate) {
            onLayoutUpdate(newGrid);
        }
    };

    // Handle column click (toggle entire column)
    const handleColumnClick = (colIndex) => {
        const newGrid = [...grid];
        const currentValue = newGrid.every(row => row[colIndex] === 1) ? 0 : 1;
        for (let i = 0; i < rows; i++) {
            newGrid[i][colIndex] = currentValue;
        }
        setGrid(newGrid);
        
        // Notify parent component of the update if callback provided
        if (onLayoutUpdate) {
            onLayoutUpdate(newGrid);
        }
    };

    // Fill grid with specific value
    const fillGrid = (value) => {
        const newGrid = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => value)
        );
        setGrid(newGrid);
        
        // Notify parent component of the update if callback provided
        if (onLayoutUpdate) {
            onLayoutUpdate(newGrid);
        }
    };

    // Clear the grid (set all cells to 0)
    const clearGrid = () => {
        fillGrid(0);
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            {/* Grid Legend */}
            <div className="flex flex-wrap justify-center gap-4 mb-4 w-full">
                {cellLegend.map((item) => (
                    <div key={item.value} className="flex items-center">
                        <div className={`w-6 h-6 ${item.color} border border-gray-400 mr-2`}></div>
                        <span className="text-sm">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Grid Tools */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    onClick={clearGrid}
                >
                    Clear Grid
                </button>
                <button
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm"
                    onClick={() => fillGrid(1)}
                >
                    Fill with Panels
                </button>
            </div>

            {/* Grid Display */}
            <div className="w-full overflow-x-auto">
                {/* Grid Header (Column Numbers) */}
                <div className="flex mb-1">
                    <div className="w-8 h-8 flex-shrink-0"></div>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <div
                            key={`col-${colIndex}`}
                            className="w-8 h-8 flex-shrink-0 flex justify-center items-center text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleColumnClick(colIndex)}
                        >
                            {colIndex + 1}
                        </div>
                    ))}
                </div>

                {/* Grid Rows */}
                <div>
                    {grid.map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex mb-1">
                            {/* Row Number */}
                            <div
                                className="w-8 h-8 flex-shrink-0 flex justify-center items-center text-sm font-medium border border-gray-300 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRowClick(rowIndex)}
                            >
                                {rowIndex + 1}
                            </div>
                            {/* Cells */}
                            {row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-8 h-8 flex-shrink-0 border border-gray-300 cursor-pointer ${cellLegend[cell]?.color}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    title={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${cellLegend[cell]?.label}`}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Info */}
            <div className="text-sm text-gray-500 mt-2">
                Click on cells to toggle between empty and solar panel. Click on row/column numbers to toggle entire rows/columns.
            </div>
        </div>
    );
};

export default GridEditor;
