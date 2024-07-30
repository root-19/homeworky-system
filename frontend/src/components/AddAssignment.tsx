import React, { useState } from 'react';

interface AddAssignmentProps {
  addAssignment: (assignment: { title: string; description: string; due_date: string; user_id: string; }) => void;
  userId: string; // Added userId to pass it from App.tsx
}

const AddAssignment: React.FC<AddAssignmentProps> = ({ addAssignment, userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !dueDate) {
      setError('Please fill all fields');
      return;
    }

    setError(null);

    try {
      await addAssignment({ title, description, due_date: dueDate, user_id: userId });
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error: any) {
      console.error('Error adding assignment:', error);
      setError(`Failed to add assignment. Error: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Assignment
      </button>
    </form>
  );
};

export default AddAssignment;

