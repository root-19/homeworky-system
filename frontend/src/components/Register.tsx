import React, { useState } from 'react';

interface RegisterProps {
  onRegister: (username: string, password: string, email: string) => void;
  switchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(username, password, email);
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
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Register
      </button>
      <button type="button" onClick={switchToLogin} className="w-full p-2 bg-gray-500 text-white rounded">
        Switch to Login
      </button>
    </form>
  );
};

export default Register;
