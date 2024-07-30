import React from 'react';
import { Assignment } from '../types';

interface Props {
  assignments: Assignment[];
  toggleComplete: (index: number) => void;
  deleteAssignment: (index: number) => void;
}

const AssignmentList: React.FC<Props> = ({ assignments, toggleComplete, deleteAssignment }) => {
  const handleDelete = async (index: number) => {
    try {
      await deleteAssignment(index);
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <h2 className="text-2xl mb-4">Assignments</h2>
      {assignments.length === 0 && <p>No assignments found.</p>}
      {assignments.map((assignment, index) => (
        <div key={index} className="p-4 mb-4 border shadow-lg">
          <h3 className="text-xl">{assignment.title}</h3>
          <p>{assignment.description}</p>
          <p>Due: {assignment.dueDate}</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => toggleComplete(index)}
              className={`p-2 ${assignment.completed ? 'bg-green-500' : 'bg-gray-500'} text-white`}
            >
              {assignment.completed ? 'Completed' : 'Mark as Complete'}
            </button>
            <button
              onClick={() => handleDelete(index)}
              className="p-2 bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentList;
