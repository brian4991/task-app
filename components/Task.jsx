import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { FaTrashAlt } from 'react-icons/fa';

const Task = ({ task, handleDeleteTask, columnId }) => {
  const { id, title, body, date, author } = task;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: id }, // Include the id property in the item object
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDeleteClick = () => {
    handleDeleteTask(id, columnId);
  };

  return (
    <div
      ref={drag}
      className={`p-4 mb-4 bg-yellow-200 rounded-lg ${isDragging ? 'opacity-50' : ''}`}
      style={{ minHeight: '80px' }}
    >
      <h3 className="text-lg font-bold mb-2">{task.title}</h3>
      <div className="text-gray-700 mb-2" style={{ maxHeight: '40px', overflow: 'hidden' }}>
        {task.body}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{task.date}</span>
        <button
          onClick={handleDeleteClick}
          className="text-red-500 hover:text-red-700"
          style={{ fontSize: '20px' }}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};



export default Task;
