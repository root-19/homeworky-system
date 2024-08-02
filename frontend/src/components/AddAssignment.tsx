import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Assignments {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
}

interface AddAssignmentProps {
  addAssignment: (assignment: Assignments) => void;
}

const AddAssignment: React.FC<AddAssignmentProps> = ({ addAssignment }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidv4(); // Generate unique ID
    addAssignment({ id, title, description, due_date: dueDate, completed: false });
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-4">Add Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AddAssignment;
