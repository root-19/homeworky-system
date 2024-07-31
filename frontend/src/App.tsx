import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import AddAssignment from './components/AddAssignment';
import AssignmentList from './components/AssignmentList';
import { Assignment } from './types';

const App: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setCurrentUser(storedUser);
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchAssignments(storedUser, storedToken);
      // fecthUsername(storedUser,storedToken);
    }
  }, []);

  const fetchAssignments = async (user: string, authToken: string) => {
    try {
      const response = await axios.get('http://localhost:3000/assignments', {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { user_id: user }
      });
      setAssignments(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching assignments:', error.response ? error.response.data : error.message);
      setError('Failed to fetch assignments. Please try again.');
    }
  };

 
  const addAssignment = async (assignment: Assignment) => {
    if (token && currentUser) {
      try {
        console.log('Adding assignment:', assignment, 'with user_id:', currentUser); // Debug log
        const response = await axios.post('http://localhost:3000/assignments', 
          { ...assignment, user_id: currentUser }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Add assignment response:', response.data); // Debug log
        await fetchAssignments(currentUser, token); // Refresh assignments list
        setError(null);
      } catch (error: any) {
        console.error('Error adding assignment:', error.response ? error.response.data : error.message);
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
  } catch (error: any) {
    console.error('Error deleting assignment:', error.response ? error.response.data : error.message, error);
    setError('Failed to delete assignment. Please try again.');
  }
};


  const handleRegister = async (username: string, password: string, email: string) => {
    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
        email
      });
      setCurrentUser(response.data.user_id.toString());
      setToken(response.data.token);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', response.data.user_id.toString());
      localStorage.setItem('token', response.data.token);
      setError(null);
    } catch (error: any) {
      console.error('Error registering:', error.response ? error.response.data : error.message);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password
      });
      setCurrentUser(response.data.user_id.toString());
      setToken(response.data.token);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', response.data.user_id.toString());
      localStorage.setItem('token', response.data.token);
      await fetchAssignments(response.data.user_id.toString(), response.data.token); 
      setError(null);
    } catch (error: any) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
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

  return (
    <div className="container mx-auto p-4">
      
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
          <h1 className="text-2xl mb-4">Welcome, {currentUser}</h1>
          <button onClick={handleLogout} className="mb-4 p-2 bg-red-500 text-white rounded">Logout</button>
          <AddAssignment addAssignment={addAssignment} />
          <AssignmentList
            assignments={assignments}
            toggleComplete={toggleComplete}
            deleteAssignment={deleteAssignment}
          />
        </div>
      )}
    </div>
  );
};

export default App;
