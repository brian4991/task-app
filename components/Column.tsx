import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import {ItemTypes}  from './ItemTypes';

interface ColumnProps {
  title: string;
  tasks: Task[];
  columnId: string;
  handleDeleteTask: (taskId: string, columnId: string) => void;
  handleTaskDrop: (taskId: string, newColumnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, columnId, handleDeleteTask, handleTaskDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => handleTaskDrop(item.id, columnId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  

  return (
    <div className={`column p-4 border border-gray-300 rounded-lg ${isOver ? 'bg-gray-100' : ''}`} ref={drop}>
      <h2 className="column-title text-center text-xl font-bold mb-4">{title}</h2>
      <div className="task-list" style={{ minHeight: '200px' }}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} handleDeleteTask={handleDeleteTask} columnId={columnId} />
        ))}
      </div>
    </div>
  );
};

export default Column;
