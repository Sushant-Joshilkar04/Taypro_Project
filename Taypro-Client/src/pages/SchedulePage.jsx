import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../utils/axiosConfig';
import { FiCalendar, FiClock, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const SchedulePage = () => {
  const layouts = useSelector(state => state.layout.layouts || []);
  const [selectedLayout, setSelectedLayout] = useState('');
  const [selectedLayoutData, setSelectedLayoutData] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [repeat, setRepeat] = useState('Do not repeat');
  const [cleaningMode, setCleaningMode] = useState('standard');
  const [upcomingCleanings, setUpcomingCleanings] = useState([]);
  const [robotStatus, setRobotStatus] = useState({
    connected: false,
    battery: 74,
    status: 'Idle',
    position: { x: 0, y: 0 },
    currentGrid: 0,
    cleaning: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [cleaningSimulation, setCleaningSimulation] = useState({
    active: false,
    path: [],
    currentStep: 0,
    gridIndex: 0
  });
  const [devTestMode, setDevTestMode] = useState(false);

  // Set today's date as default
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
    
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError(true);
      return;
    }
    
    // Fetch upcoming cleanings
    fetchUpcomingCleanings();
    
    // Get robot status
    fetchRobotStatus();

    // Simulate robot status updates with websocket-like behavior
    const intervalId = setInterval(fetchRobotStatus, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Update selected layout data when layout selection changes
  useEffect(() => {
    if (selectedLayout) {
      const layoutData = layouts.find(layout => layout._id === selectedLayout);
      setSelectedLayoutData(layoutData);
      
      // Reset robot position when layout changes
      setRobotStatus(prev => ({
        ...prev,
        position: { x: 0, y: 0 },
        currentGrid: 0,
        status: 'Ready',
        cleaning: false
      }));
      
      // Stop any active cleaning simulation
      setCleaningSimulation({
        active: false,
        path: [],
        currentStep: 0,
        gridIndex: 0
      });
    } else {
      setSelectedLayoutData(null);
    }
  }, [selectedLayout, layouts]);

  // Run cleaning simulation
  useEffect(() => {
    let simulationInterval = null;
    
    if (cleaningSimulation.active && cleaningSimulation.path && cleaningSimulation.path.length > 0) {
      try {
        simulationInterval = setInterval(() => {
          setCleaningSimulation(prev => {
            // Safety check for path length
            if (!prev.path || prev.path.length === 0) {
              return { ...prev, active: false };
            }
            
            // Check if we've completed the current path
            if (prev.currentStep >= prev.path.length - 1) {
              // Safety check for selectedLayoutData
              if (!selectedLayoutData || !selectedLayoutData.grids) {
                return { ...prev, active: false };
              }
              
              const currentGrids = selectedLayoutData.grids;
              
              // If there are more grids to clean
              if (prev.gridIndex < currentGrids.length - 1) {
                // Move to next grid
                const nextGridIndex = prev.gridIndex + 1;
                const nextGrid = currentGrids[nextGridIndex];
                
                // Safety check for next grid
                if (!nextGrid || !nextGrid.rows || !nextGrid.cols) {
                  console.error("Invalid next grid data");
                  return { ...prev, active: false };
                }
                
                // Generate path for next grid
                const newPath = generateZigZagPath(nextGrid.rows, nextGrid.cols);
                
                // Add transition notification
                setRobotStatus(robot => ({
                  ...robot,
                  status: `Moving to Grid ${nextGridIndex + 1}...`,
                  position: { x: 0, y: 0 },
                  currentGrid: nextGridIndex
                }));
                
                // Add a pause between grids
                setTimeout(() => {
                  setRobotStatus(robot => ({
                    ...robot,
                    status: `Cleaning Grid ${nextGridIndex + 1}`
                  }));
                }, 1500);
                
                return {
                  ...prev,
                  path: newPath,
                  currentStep: 0,
                  gridIndex: nextGridIndex
                };
              } else {
                // All grids completed
                if (simulationInterval) {
                  clearInterval(simulationInterval);
                }
                
                setRobotStatus(robot => ({
                  ...robot,
                  status: 'Cleaning Complete',
                  cleaning: false,
                  position: { x: 0, y: 0 }
                }));
                
                return {
                  ...prev,
                  active: false
                };
              }
            } else {
              // Move to next position in the path
              const nextStep = prev.currentStep + 1;
              if (!prev.path[nextStep]) {
                console.error("Invalid path step:", nextStep);
                return { ...prev, active: false };
              }
              
              const nextPosition = prev.path[nextStep];
              
              setRobotStatus(robot => ({
                ...robot,
                position: nextPosition,
                status: `Cleaning Grid ${prev.gridIndex + 1}`
              }));
              
              return {
                ...prev,
                currentStep: nextStep
              };
            }
          });
        }, getCleaningSpeed());
      } catch (error) {
        console.error("Error in cleaning simulation:", error);
        if (simulationInterval) {
          clearInterval(simulationInterval);
        }
        
        // Reset to safe state
        setRobotStatus(prev => ({
          ...prev,
          status: 'Error in cleaning process',
          cleaning: false
        }));
        
        setCleaningSimulation(prev => ({
          ...prev,
          active: false
        }));
      }
      
      return () => {
        if (simulationInterval) {
          clearInterval(simulationInterval);
        }
      };
    }
  }, [cleaningSimulation.active, selectedLayoutData]);

  // Get cleaning speed based on cleaning mode
  const getCleaningSpeed = () => {
    // Get a base speed dependent on cleaning mode
    let baseSpeed;
    switch (cleaningMode) {
      case 'eco':
        baseSpeed = 800; // Slower
        break;
      case 'deep':
        baseSpeed = 300; // Faster
        break;
      case 'standard':
      default:
        baseSpeed = 500; // Medium speed
    }
    
    // Slow down transitional movements slightly
    const position = robotStatus.position;
    if (position && position.y % 1 !== 0) {
      // If we're in a transitional movement between rows, slow down a bit
      return baseSpeed * 1.3;
    }
    
    return baseSpeed;
  };

  // Display cleaning mode info in a more visual way
  const getCleaningModeInfo = () => {
    switch (cleaningMode) {
      case 'eco':
        return {
          name: 'Eco Mode',
          color: 'text-green-600',
          speed: 'Slow & Energy Efficient',
          icon: '🍃'
        };
      case 'deep':
        return {
          name: 'Deep Clean Mode',
          color: 'text-red-600',
          speed: 'Fast & Powerful',
          icon: '⚡'
        };
      case 'standard':
      default:
        return {
          name: 'Standard Mode',
          color: 'text-blue-600',
          speed: 'Balanced Performance',
          icon: '✓'
        };
    }
  };

  // Generate a zig-zag path through a grid
  const generateZigZagPath = (rows, cols) => {
    const path = [];
    
    for (let y = 0; y < rows; y++) {
      if (y % 2 === 0) { // Even rows - left to right
        for (let x = 0; x < cols; x++) {
          path.push({ x, y });
        }
        
        // Add transition step to the next row if not the last row
        if (y < rows - 1) {
          // Add intermediate steps for smooth transition to next row
          path.push({ x: cols - 1, y: y + 0.5 }); // Half step down
        }
      } else { // Odd rows - right to left
        for (let x = cols - 1; x >= 0; x--) {
          path.push({ x, y });
        }
        
        // Add transition step to the next row if not the last row
        if (y < rows - 1) {
          // Add intermediate steps for smooth transition to next row
          path.push({ x: 0, y: y + 0.5 }); // Half step down
        }
      }
    }
    
    return path;
  };

  // Start cleaning simulation
  const startCleaningSimulation = (layoutDataOverride = null) => {
    // Use either the provided layout data override or the state value
    const layoutData = layoutDataOverride || selectedLayoutData;
    
    // Safety check to ensure layout data exists
    if (!layoutData || !layoutData.grids || layoutData.grids.length === 0) {
      console.error("Cannot start cleaning - no layout data available");
      return;
    }
    
    try {
      const firstGrid = layoutData.grids[0];
      
      // Another safety check for the first grid
      if (!firstGrid || !firstGrid.rows || !firstGrid.cols) {
        console.error("Invalid grid data in selected layout");
        return;
      }
      
      const path = generateZigZagPath(firstGrid.rows, firstGrid.cols);
      
      // Start the cleaning process
      setRobotStatus(prev => ({
        ...prev,
        status: `Cleaning Grid 1 of ${layoutData.grids.length}`,
        position: { x: 0, y: 0 },
        currentGrid: 0,
        cleaning: true
      }));
      
      setCleaningSimulation({
        active: true,
        path: path,
        currentStep: 0,
        gridIndex: 0
      });
      
      console.log("Cleaning simulation started for layout:", layoutData.name);
    } catch (error) {
      console.error("Error starting cleaning simulation:", error);
      // Reset to safe state
      setRobotStatus(prev => ({
        ...prev,
        status: 'Error starting cleaning',
        cleaning: false
      }));
    }
  };

  // Fetch upcoming cleanings
  const fetchUpcomingCleanings = async () => {
    try {
      const response = await axiosInstance.get('/cleaning/upcoming');
      setUpcomingCleanings(response.data);
      setAuthError(false);
    } catch (error) {
      console.error('Error fetching upcoming cleanings:', error);
      if (error.response && error.response.status === 401) {
        setAuthError(true);
      }
    }
  };

  // Check for development test mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('devtest') === 'true') {
      console.log("Development testing mode enabled");
      setDevTestMode(true);
    }
  }, []);

  // Handle form submission for scheduling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLayout || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Schedule the cleaning in the backend
      const response = await axiosInstance.post('/cleaning/schedule', {
        layoutId: selectedLayout,
        date,
        time,
        repeat,
        cleaningMode
      });
      
      // Store the scheduled cleaning in localStorage to ensure it persists across page reloads
      const scheduledTime = new Date(`${date}T${time}`);
      const layoutData = layouts.find(layout => layout._id === selectedLayout);
      
      // Store scheduling info in localStorage
      const schedulingInfo = {
        id: response.data?._id || Date.now().toString(),
        layoutId: selectedLayout,
        layoutName: layoutData?.name || "Selected Layout",
        date,
        time,
        cleaningMode,
        scheduledTime: scheduledTime.getTime(),
        hasStarted: false
      };
      
      // Get existing schedules or initialize empty array
      const existingSchedules = JSON.parse(localStorage.getItem('scheduledCleanings') || '[]');
      existingSchedules.push(schedulingInfo);
      localStorage.setItem('scheduledCleanings', JSON.stringify(existingSchedules));
      
      // Refresh the upcoming cleanings list
      fetchUpcomingCleanings();
      
      // Update robot status to show scheduled time
      setRobotStatus(prev => ({
        ...prev,
        status: `Scheduled for ${date} at ${time}`,
      }));
      
      alert('Cleaning scheduled successfully!');
      
      // Add a console message for debugging
      console.log(`Cleaning scheduled for ${date} at ${time}`);
      
      // Calculate time until scheduled cleaning for logging purposes only
      const now = new Date();
      const timeUntilCleaning = scheduledTime.getTime() - now.getTime();
      
      if (timeUntilCleaning > 0) {
        console.log(`Cleaning will start in ${Math.round(timeUntilCleaning/1000)} seconds`);
        // No longer refreshing the page before scheduled time
      }
    } catch (error) {
      console.error("Error scheduling cleaning:", error);
      alert('Failed to schedule cleaning.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if any scheduled cleanings should start now (more frequent polling)
  useEffect(() => {
    const checkScheduledCleanings = () => {
      if (robotStatus.cleaning) {
        return; // Already cleaning, don't start another one
      }
      
      try {
        // Get stored schedules
        const storedSchedules = JSON.parse(localStorage.getItem('scheduledCleanings') || '[]');
        const now = new Date().getTime();
        
        for (const schedule of storedSchedules) {
          // Skip schedules that have already started
          if (schedule.hasStarted) continue;
          
          const scheduledTime = schedule.scheduledTime;
          const timeDiff = Math.abs(now - scheduledTime);
          
          // If within 30 seconds of scheduled time
          if (timeDiff < 30000) {
            console.log(`Time to start scheduled cleaning for ${schedule.layoutName} (from periodic check)`);
            
            // Find the layout data
            const layoutToClean = layouts.find(l => l._id === schedule.layoutId);
            
            if (layoutToClean) {
              // Mark this schedule as started
              schedule.hasStarted = true;
              localStorage.setItem('scheduledCleanings', JSON.stringify(storedSchedules));
              
              // Set up the layout and cleaning mode for UI display
              setSelectedLayout(schedule.layoutId);
              setSelectedLayoutData(layoutToClean);
              setCleaningMode(schedule.cleaningMode);
              
              // Start cleaning - set status first
              setRobotStatus(prev => ({
                ...prev,
                status: 'Starting scheduled cleaning...',
                position: { x: 0, y: 0 },
                currentGrid: 0,
                cleaning: true
              }));
              
              // Pass the layout data directly to startCleaningSimulation
              // instead of waiting for state update
              setTimeout(() => {
                console.log("Cleaning started for:", schedule.layoutName);
                startCleaningSimulation(layoutToClean);
              }, 1000);
              
              break; // Only start one cleaning
            }
          }
        }
      } catch (error) {
        console.error("Error checking scheduled cleanings:", error);
      }
    };
    
    // Check every 5 seconds (much more frequent than before)
    const schedulerInterval = setInterval(checkScheduledCleanings, 5000);
    
    // Check once immediately
    checkScheduledCleanings();
    
    return () => clearInterval(schedulerInterval);
  }, [robotStatus.cleaning, layouts]);

  // Check for stored scheduled cleanings on component mount
  useEffect(() => {
    // Get stored schedules
    try {
      const storedSchedules = JSON.parse(localStorage.getItem('scheduledCleanings') || '[]');
      console.log("Found stored schedules:", storedSchedules);
      
      // If there are stored schedules and we're not already cleaning, check if any should start
      if (storedSchedules.length > 0 && !robotStatus.cleaning) {
        const now = new Date().getTime();
        
        // Check each stored schedule
        for (const schedule of storedSchedules) {
          // Only process schedules that haven't started yet
          if (!schedule.hasStarted) {
            const scheduledTime = schedule.scheduledTime;
            const timeDiff = now - scheduledTime;
            
            // If the cleaning should have started within the last hour (missed due to page being closed)
            // or is within 2 minutes of starting
            if ((timeDiff > 0 && timeDiff < 3600000) || (timeDiff < 0 && timeDiff > -120000)) {
              console.log(`Time to start scheduled cleaning for ${schedule.layoutName}`);
              
              // Find the layout data
              const layoutToClean = layouts.find(l => l._id === schedule.layoutId);
              
              if (layoutToClean) {
                // Mark this schedule as started in localStorage
                schedule.hasStarted = true;
                localStorage.setItem('scheduledCleanings', JSON.stringify(storedSchedules));
                
                // Set up the layout and cleaning mode for UI display
                setSelectedLayout(schedule.layoutId);
                setSelectedLayoutData(layoutToClean);
                setCleaningMode(schedule.cleaningMode);
                
                // Start cleaning with a delay, but pass layout data directly
                setTimeout(() => {
                  console.log("Starting cleaning for scheduled task:", schedule.layoutName);
                  startCleaningSimulation(layoutToClean);
                }, 2000);
                
                break; // Only start one cleaning
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing stored schedules:", error);
    }
  }, [layouts, robotStatus.cleaning]);

  const fetchRobotStatus = async () => {
    try {
      const response = await axiosInstance.get('/cleaning/robot-status');
      setRobotStatus(prev => ({
        ...prev,
        connected: true,
        battery: response.data.battery || prev.battery,
        // Only update status and position if not in a cleaning simulation
        status: cleaningSimulation.active ? prev.status : response.data.status || prev.status,
        position: cleaningSimulation.active ? prev.position : response.data.position || prev.position
      }));
      setAuthError(false);
    } catch (error) {
      console.error('Error fetching robot status:', error);
      setRobotStatus(prev => ({
        ...prev,
        connected: false
      }));
      if (error.response && error.response.status === 401) {
        setAuthError(true);
      }
    }
  };

  // Generate grid cells for the robot position map
  const generateGrid = () => {
    if (!selectedLayoutData || !selectedLayoutData.grids || selectedLayoutData.grids.length === 0) {
      return null;
    }
    
    const currentGrid = selectedLayoutData.grids[robotStatus.currentGrid] || selectedLayoutData.grids[0];
    const { rows, cols } = currentGrid;
    const grid = [];
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Check if robot is at this position or in a transitional state nearby
        const isRobotHere = isRobotAtPosition(j, i, cols);
        const isSolarPanel = currentGrid.layout && currentGrid.layout[i] && currentGrid.layout[i][j] === 1;
        
        grid.push(
          <div 
            key={`${i}-${j}`} 
            className={`border border-gray-200 w-6 h-6 ${isRobotHere ? 'bg-blue-500' : isSolarPanel ? 'bg-green-200' : 'bg-gray-100'}`}
          />
        );
      }
    }
    
    return (
      <div 
        className="grid gap-0 mx-auto border border-gray-300" 
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: `${cols * 28}px`
        }}
      >
        {grid}
      </div>
    );
  };

  // Determine if the robot is at or near a specific position (handles transitions)
  const isRobotAtPosition = (x, y, gridCols) => {
    // For exact position
    if (Math.floor(robotStatus.position.x) === x && Math.floor(robotStatus.position.y) === y) {
      return true;
    }
    
    // For transitional positions (halfway between cells)
    const posX = robotStatus.position.x;
    const posY = robotStatus.position.y;
    
    // Check if robot is in transition between rows
    if (posY % 1 !== 0) { // If y has a decimal part (transitioning between rows)
      const floorY = Math.floor(posY);
      if (floorY === y || floorY + 1 === y) {
        // If in a row transition, highlight both the start and end cells
        if ((floorY % 2 === 0 && x === gridCols - 1) || (floorY % 2 === 1 && x === 0)) {
          return true;
        }
      }
    }
    
    return false;
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {authError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Authentication Error!</strong>
            <span className="block sm:inline"> You need to be logged in to access this page.</span>
          </div>
        ) : null}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Schedule Form */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-xl font-bold text-gray-800 mb-6">Schedule a Cleaning Session</h1>
              
              <form onSubmit={handleSubmit}>
                {/* Layout Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Select Layout</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedLayout}
                    onChange={(e) => setSelectedLayout(e.target.value)}
                    required
                  >
                    <option value="">Select a layout</option>
                    {layouts.map(layout => (
                      <option key={layout._id} value={layout._id}>{layout.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                      <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                    <div className="relative">
                      <input 
                        type="time" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                      <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Repeat */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Repeat</label>
                  <div className="relative">
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={repeat}
                      onChange={(e) => setRepeat(e.target.value)}
                    >
                      <option value="Do not repeat">Do not repeat</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                    <FiRefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                {/* Cleaning Mode */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Cleaning Mode</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Eco Mode */}
                    <div 
                      className={`border ${cleaningMode === 'eco' ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-md p-4 cursor-pointer hover:border-green-500`}
                      onClick={() => setCleaningMode('eco')}
                    >
                      <div className="flex items-center mb-1">
                        <input 
                          type="radio" 
                          id="eco" 
                          name="cleaningMode" 
                          value="eco"
                          checked={cleaningMode === 'eco'}
                          onChange={() => setCleaningMode('eco')}
                          className="mr-2"
                        />
                        <label htmlFor="eco" className="font-medium">Eco</label>
                      </div>
                      <p className="text-xs text-gray-500">Low power, quieter</p>
                    </div>
                    
                    {/* Standard Mode */}
                    <div 
                      className={`border ${cleaningMode === 'standard' ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-md p-4 cursor-pointer hover:border-green-500`}
                      onClick={() => setCleaningMode('standard')}
                    >
                      <div className="flex items-center mb-1">
                        <input 
                          type="radio" 
                          id="standard" 
                          name="cleaningMode"
                          value="standard"
                          checked={cleaningMode === 'standard'}
                          onChange={() => setCleaningMode('standard')}
                          className="mr-2"
                        />
                        <label htmlFor="standard" className="font-medium">Standard</label>
                      </div>
                      <p className="text-xs text-gray-500">Balanced performance</p>
                    </div>
                    
                    {/* Deep Clean Mode */}
                    <div 
                      className={`border ${cleaningMode === 'deep' ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded-md p-4 cursor-pointer hover:border-green-500`}
                      onClick={() => setCleaningMode('deep')}
                    >
                      <div className="flex items-center mb-1">
                        <input 
                          type="radio" 
                          id="deep" 
                          name="cleaningMode"
                          value="deep"
                          checked={cleaningMode === 'deep'}
                          onChange={() => setCleaningMode('deep')}
                          className="mr-2"
                        />
                        <label htmlFor="deep" className="font-medium">Deep Clean</label>
                      </div>
                      <p className="text-xs text-gray-500">Maximum power</p>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                    disabled={isLoading || !selectedLayout}
                  >
                    {isLoading ? 'Scheduling...' : 'Schedule Cleaning'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Upcoming Cleanings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Cleanings</h2>
              
              {upcomingCleanings.length === 0 ? (
                <p className="text-gray-500">No upcoming cleanings scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingCleanings.map(cleaning => (
                    <div key={cleaning._id} className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FiClock className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cleaning.layoutName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(cleaning.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} 
                            &nbsp;at {cleaning.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this cleaning?')) {
                              axiosInstance.delete(`/cleaning/${cleaning._id}`)
                                .then(() => fetchUpcomingCleanings())
                                .catch(err => console.error('Error deleting cleaning:', err));
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Robot Status */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Robot Status</h2>
              
              {/* No Layout Selected Warning */}
              {!selectedLayout && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex items-center">
                    <FiAlertCircle className="text-yellow-600 mr-2" />
                    <p className="text-yellow-800">
                      You haven't selected a layout yet. Please select a layout to see the robot's cleaning path.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Connection Status */}
              {!robotStatus.connected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <p className="text-yellow-800">
                    Could not connect to robot. Using simulated data.
                  </p>
                </div>
              )}
              
              {/* Battery and Status */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <span className={`inline-block h-4 w-4 rounded-full ${robotStatus.cleaning ? 'bg-green-500' : 'bg-yellow-400'} mr-2`}></span>
                  <span className="text-gray-700">{robotStatus.status}</span>
                </div>
                <div className="ml-auto flex items-center">
                  <div className="bg-gray-200 h-3 w-32 rounded-full overflow-hidden mr-2">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${robotStatus.battery}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700">{robotStatus.battery}%</span>
                </div>
              </div>
              
              {/* Layout Information */}
              {selectedLayoutData && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Layout: {selectedLayoutData.name}</h3>
                  <p className="text-gray-600 mb-2">
                    Total Grids: {selectedLayoutData.grids?.length || 0}
                  </p>
                  {robotStatus.cleaning && (
                    <p className="text-blue-600">
                      Currently cleaning grid {robotStatus.currentGrid + 1} of {selectedLayoutData.grids?.length}
                    </p>
                  )}
                </div>
              )}
              
              {/* Robot Position */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Robot Position</h3>
                
                {selectedLayout ? (
                  <div className="overflow-x-auto">
                  {generateGrid()}
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Green cells: Solar panels | Blue cell: Robot position</p>
                    </div>
                    
                    {robotStatus.cleaning && (
                      <div className="mt-4">
                        <p className="text-gray-700">
                          <strong>Current Position:</strong> Row {Math.floor(robotStatus.position.y) + 1}, Column {Math.floor(robotStatus.position.x) + 1}
                        </p>
                        <div className="flex items-center mt-2">
                          <strong className="mr-2">Cleaning Mode:</strong>
                          <span className={`${getCleaningModeInfo().color} flex items-center`}>
                            <span className="mr-1">{getCleaningModeInfo().icon}</span>
                            {getCleaningModeInfo().name} ({getCleaningModeInfo().speed})
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Section (Replaces Manual Controls) */}
                    {!robotStatus.cleaning && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Status</h3>
                        <p className="text-gray-600">
                          {robotStatus.status === 'Idle' || robotStatus.status === 'Ready'
                            ? 'Robot is ready. Schedule a cleaning to start at your desired time.' 
                            : robotStatus.status}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-100 rounded-md">
                    <p className="text-gray-500">Select a layout to view the robot's position</p>
                </div>
                )}
              </div>
              
              {/* Development Testing Panel - Only visible with URL parameter ?devtest=true */}
              {devTestMode && selectedLayout && (
                <div className="mt-6 p-4 border border-orange-300 bg-orange-50 rounded-lg">
                  <h3 className="text-lg font-medium text-orange-800 mb-2">Development Testing Controls</h3>
                  <p className="text-sm text-orange-700 mb-4">These controls are only visible in development testing mode.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startCleaningSimulation()}
                      disabled={robotStatus.cleaning}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                    >
                      Test Cleaning Now
                    </button>
                    
                    <button
                      onClick={() => {
                        setRobotStatus(prev => ({
                          ...prev,
                          cleaning: false,
                          status: 'Idle',
                          position: { x: 0, y: 0 },
                          currentGrid: 0
                        }));
                        
                        setCleaningSimulation({
                          active: false,
                          path: [],
                          currentStep: 0,
                          gridIndex: 0
                        });
                      }}
                      disabled={!robotStatus.cleaning}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                    >
                      Stop Cleaning
                    </button>
                  </div>
                  
                  <p className="text-xs text-orange-600 mt-2">
                    Note: In production, cleaning will only start at the scheduled time. This is for testing only.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage; 