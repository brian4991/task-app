import React, { useState, useEffect } from 'react';
import Column from '../components/Column';
import TaskInput from '../components/TaskInput';
import { firebaseConfig } from '../src/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const newApp = initializeApp(firebaseConfig);
const db = getFirestore(newApp);

// Get reference to the "Tasks" collection in Firestore
const tasksCollection = collection(db, 'tasks');

interface Task {
  id: string;
  title: string;
  status: string;
}

export default function Home() {
  const [boardTasks, setBoardTasks] = useState<BoardTasks>({
    toDo: [],
    inProgress: [],
    done: [],
  });

  // Fetch tasks from Firestore on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksSnapshot = await getDocs(tasksCollection);
        const fetchedTasks: BoardTasks = {};

        tasksSnapshot.forEach((doc) => {
          const task = doc.data() as Task;
          const { status } = task;

          if (fetchedTasks[status]) {
            fetchedTasks[status].push(task);
          } else {
            fetchedTasks[status] = [task];
          }
        });

        setBoardTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (title: string, status: string) => {
    try {
      const taskId = Math.random().toString();
      const newTask: Task = {
        id: taskId,
        title: title,
        status: status,
      };

      await setDoc(doc(tasksCollection, taskId), newTask);

      setBoardTasks((prevTasks) => ({
        ...prevTasks,
        [status]: [...(prevTasks[status] || []), newTask],
      }));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string, columnId: string) => {
    try {
      await deleteDoc(doc(tasksCollection, taskId));

      setBoardTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const columnTasks = [...(updatedTasks[columnId] ?? [])];

        const taskIndex = columnTasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          columnTasks.splice(taskIndex, 1);
          updatedTasks[columnId] = columnTasks;
        }

        return updatedTasks;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  
  
  const handleTaskDrop = async (taskId: string, newColumnId: string) => {
    try {
      await updateDoc(doc(tasksCollection, taskId), { status: newColumnId });
  
      // Fetch the updated tasks from Firestore
      const updatedTasksSnapshot = await getDocs(tasksCollection);
      const updatedTasks: BoardTasks = {};
  
      updatedTasksSnapshot.forEach((doc) => {
        const task = doc.data() as Task;
        const { status } = task;
  
        if (updatedTasks[status]) {
          updatedTasks[status].push(task);
        } else {
          updatedTasks[status] = [task];
        }
      });
  
      setBoardTasks(updatedTasks);
  
      // Show a pop-up notification
      toast.success('Task moved successfully!');
    } catch (error) {
      console.error('Error updating task column ID:', error);
      // Show an error pop-up notification
      toast.error('Failed to move task. Please try again.');
    }
  };
  

  return (
    <div className="flex flex-col h-screen items-center p-4">
      <div className="mb-8">
        <TaskInput handleAddTask={handleAddTask} />
      </div>
      <div className="flex justify-between h-3/4 w-full gap-4">
        <div className="w-1/3">
          <Column
            title="To Do"
            tasks={boardTasks.toDo || []}
            columnId="toDo"
            handleTaskDrop={handleTaskDrop}
            handleDeleteTask={handleDeleteTask}
          />
        </div>
        <div className="w-1/3">
          <Column
            title="In Progress"
            tasks={boardTasks.inProgress || []}
            columnId="inProgress"
            handleTaskDrop={handleTaskDrop}
            handleDeleteTask={handleDeleteTask}
          />
        </div>
        <div className="w-1/3">
          <Column
            title="Done"
            tasks={boardTasks.done || []}
            columnId="done"
            handleTaskDrop={handleTaskDrop}
            handleDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}
