import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddAssignment from './components/AddAssignment';
import AssignmentList from './components/AssignmentList';
import { Assignment } from './types';

const App: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedUser && storedToken && storedUsername) {
      setCurrentUser(storedUser);
      setUsername(storedUsername);
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchAssignments(storedUser, storedToken);
    }
  }, []);

  const fetchAssignments = async (user: string, authToken: string) => {
    try {
      const response = await axios.get<Assignment[]>('http://localhost:3000/assignments', {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { user_id: user }
      });
      setAssignments(response.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching assignments:', axiosError.response ? axiosError.response.data : axiosError.message);
      setError('Failed to fetch assignments. Please try again.');
    }
  };

  const addAssignment = async (assignment: Assignment) => {
    if (token && currentUser) {
      try {
        console.log('Adding assignment:', assignment, 'with user_id:', currentUser);
        const response = await axios.post<Assignment>('http://localhost:3000/assignments', 
          { ...assignment, user_id: currentUser }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Add assignment response:', response.data);
        await fetchAssignments(currentUser, token);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error adding assignment:', axiosError.response ? axiosError.response.data : axiosError.message);
        setError('Failed to add assignment. Please try again.');
      }
    }
  };

  const toggleComplete = (index: number) => {
    const newAssignments = [...assignments];
    newAssignments[index].completed = !newAssignments[index].completed;
    setAssignments(newAssignments);
  };

  const deleteAssignment = async (index: number) => {
    const assignmentToDelete = assignments[index];
    try {
      console.log('Deleting assignment with ID:', assignmentToDelete.id);
      console.log('Authorization Token:', token);
      await axios.delete(`http://localhost:3000/assignments/${assignmentToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(assignments.filter((_, i) => i !== index));
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting assignment:', axiosError.response ? axiosError.response.data : axiosError.message, error);
      setError('Failed to delete assignment. Please try again.');
    }
  };

  const handleRegister = async (username: string, password: string, email: string) => {
    try {
      const response = await axios.post<{ user_id: string; username: string; token: string }>('http://localhost:3000/register', {
        username,
        password,
        email
      });
      setCurrentUser(response.data.user_id.toString());
      setUsername(response.data.username);
      setToken(response.data.token);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', response.data.user_id.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('token', response.data.token);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error registering:', axiosError.response ? axiosError.response.data : axiosError.message);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post<{ user_id: string; username: string; token: string }>('http://localhost:3000/login', {
        username,
        password
      });
      setCurrentUser(response.data.user_id.toString());
      setUsername(response.data.username);
      setToken(response.data.token);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', response.data.user_id.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('token', response.data.token);
      await fetchAssignments(response.data.user_id.toString(), response.data.token);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error logging in:', axiosError.response ? axiosError.response.data : axiosError.message);
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleChat = () => {
    navigate('/chat'); // Ensure this matches the route path in your router setup
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl">Assignment Tracker</h1> */}
      <header className="flex items-center justify-between mb-4">
        
        <button className="lg:hidden p-2" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        {isAuthenticated && (
          <div className={`lg:flex items-center ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <button onClick={handleChat} className="mb-4 lg:mb-0 lg:ml-4 p-2 bg-blue-500 text-white rounded">
              Chat
            </button>
            <button onClick={handleLogout} className="mb-4 lg:mb-0 lg:ml-4 p-2 bg-red-500 text-white rounded">
              Logout
            </button>
          </div>
        )}
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!isAuthenticated ? (
        <div className="flex justify-center">
          
          <div className="w-full max-w-md p-4 border rounded-lg shadow-md">
            {showLogin ? (
              <Login onLogin={handleLogin} switchToRegister={() => setShowLogin(false)} />
            ) : (
              <Register onRegister={handleRegister} switchToLogin={() => setShowLogin(true)} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            
            <h2 className="text-xl mb-2">Welcome, {username}</h2>
            <button onClick={handleLogout} className="lg:hidden mb-4 p-2 bg-red-500 text-white rounded">
              Logout
            </button>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="p-4 border rounded-lg shadow-md">
              <AddAssignment addAssignment={addAssignment} />
            </div>
            <div className="p-4 border rounded-lg shadow-md">
              <AssignmentList
                assignments={assignments}
                toggleComplete={toggleComplete}
                deleteAssignment={deleteAssignment}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
