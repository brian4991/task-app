import React, { useState } from 'react';

type TaskInputProps = {
  handleAddTask: (title: string, status: string) => void;
};

const TaskInput: React.FC<TaskInputProps> = ({ handleAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTask(taskTitle, 'toDo'); // Pass the status as 'to-do'
    setTaskTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={taskTitle}
        onChange={handleInputChange}
        placeholder="Enter task title"
        className="px-2 py-1 border border-gray-300 rounded-l focus:outline-none"
      />
      <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600">
        Add Task
      </button>
    </form>
  );
};

export default TaskInput;