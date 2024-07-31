import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate('/chat');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold">Assignment Tracker</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleChat}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded transition"
        >
          Chat
        </button>
        <button
          onClick={() => console.log('Logout')}
          className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
