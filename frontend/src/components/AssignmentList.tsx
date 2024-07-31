import React from 'react';
import { Assignment } from '../types';

interface AssignmentListProps {
  assignments: Assignment[];
  toggleComplete: (index: number) => void;
  deleteAssignment: (index: number) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, toggleComplete, deleteAssignment }) => {
  return (
    <div>
      <h2 className="text-xl mb-4">Assignments</h2>
      <ul>
        {assignments.map((assignment, index) => (
          <li key={assignment.id} className="mb-2 p-2 border rounded flex justify-between items-center">
            <div>
              <h3 className={`text-lg ${assignment.completed ? 'line-through' : ''}`}>{assignment.title}</h3>
              <p className="text-sm">{assignment.description}</p>
              <p className="text-xs text-gray-500">Due: {assignment.due_date}</p>
            </div>
            <div>
              <button onClick={() => toggleComplete(index)} className="mr-2 p-1 bg-blue-500 text-white rounded">
                {assignment.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => deleteAssignment(index)} className="p-1 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
