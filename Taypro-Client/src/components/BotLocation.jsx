import { useState, useEffect } from "react";
import axios from "axios";

const BotLocation = () => {
  const [botData, setBotData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBotLocation = async () => {
      try {
        const response = await axios.get("https://taypro-project.vercel.app/api/bot/bot-location");
        setBotData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bot location:", err.message);
        setError("Failed to load bot data.");
      }
    };

    fetchBotLocation(); // Fetch on load

    const interval = setInterval(fetchBotLocation, 5000); // Auto-refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Bot Location</h2>

      {error && <p className="text-red-500">{error}</p>}

      {botData ? (
        <div className="text-lg text-gray-700">
          <p>
            <strong>X Coordinate:</strong> {botData.x}
          </p>
          <p>
            <strong>Y Coordinate:</strong> {botData.y}
          </p>
          <p className="text-sm text-gray-500">
            Last Updated: {new Date(botData.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading bot location...</p>
      )}
    </div>
  );
};

export default BotLocation;