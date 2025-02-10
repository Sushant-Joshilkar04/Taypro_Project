import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  const handleHomeButtonClick = () => {
    navigate('/');
  };

  return (
    <div className=" h-screen pt-12">
      <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button onClick={handleHomeButtonClick} className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600">
          Go to Home
        </button>
      </div>
    </div>

  );
}

export default NotFound;
