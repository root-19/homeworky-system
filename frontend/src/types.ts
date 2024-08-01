// types.ts
export interface Assignments {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
}

export interface User {
  id: number;
  name: string;
  // other user fields
}

export interface ChatProps {
  user: User | null; // Allowing user to be null initially
}
