import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const CleaningStats = () => {
  const [cleaningStats, setCleaningStats] = useState([]);
  const [botStatus, setBotStatus] = useState(null);

  useEffect(() => {
    // Listen for cleaning stats updates
    socket.on("updateCleaningStats", (newStats) => {
      setCleaningStats((prevStats) => [newStats, ...prevStats]); // Add new data
    });

    // Listen for bot status updates
    socket.on("updateBotStatus", (status) => {
      setBotStatus(status);
    });

    return () => {
      socket.off("updateCleaningStats");
      socket.off("updateBotStatus");
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">📊 Cleaning Stats (Live)</h2>

      {botStatus && (
        <div className="bg-white p-3 shadow rounded mb-4">
          <h3 className="text-lg font-semibold">🟢 Bot Status</h3>
          <p><strong>Bot ID:</strong> {botStatus.botId}</p>
          <p><strong>Battery Level:</strong> {botStatus.batteryLevel}%</p>
          <p><strong>Last Updated:</strong> {new Date(botStatus.lastUpdated).toLocaleString()}</p>
        </div>
      )}

      <h3 className="text-lg font-semibold">📍 Cleaning History</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cleaningStats.map((stat, index) => (
          <div key={index} className="bg-white p-3 shadow rounded">
            <p><strong>Layout ID:</strong> {stat.layoutId}</p>
            <p><strong>Total Cycles:</strong> {stat.totalCycles}</p>
            <p><strong>Efficiency:</strong> {stat.efficiency}%</p>
            <p><strong>Battery:</strong> {stat.batteryLevel}%</p>
            <p><strong>Last Cleaned:</strong> {new Date(stat.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleaningStats;
