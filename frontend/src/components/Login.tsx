import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  switchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, switchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Login
      </button>
      <button type="button" onClick={switchToRegister} className="w-full p-2 bg-gray-500 text-white rounded">
        Switch to Register
      </button>
    </form>
  );
};

export default Login;
