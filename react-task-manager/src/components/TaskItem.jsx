import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, toggleTaskCompletion } from '../redux/tasksSlice';

const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch();

  const priorityStyles = {
    High: 'bg-danger text-white',
    Medium: 'bg-warning text-black',
    Low: 'bg-success text-white',
  };

  return (
    <div className={`neo-card neo-card-hover p-4 flex items-center gap-4 ${task.completed ? 'opacity-40 grayscale' : 'bg-white'}`}>
      {/* Checkbox */}
      <button
        onClick={() => dispatch(toggleTaskCompletion(task.id))}
        className={`w-8 h-8 border-4 border-black flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${task.completed ? 'bg-black text-white' : 'bg-white hover:bg-primary'}`}
      >
        {task.completed && (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        )}
      </button>
      
      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-xl font-black truncate tracking-tight ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </h3>
      </div>

      {/* Priority Badge - Next to task */}
      <div className={`neo-badge ${priorityStyles[task.priority]} whitespace-nowrap`}>
        {task.priority}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-l-4 border-black pl-4 ml-2">
        <button
          onClick={() => onEdit(task)}
          className="p-1 hover:bg-black/5 rounded transition-colors cursor-pointer"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button
          onClick={() => dispatch(deleteTask(task.id))}
          className="p-1 text-danger hover:bg-danger/10 rounded transition-colors cursor-pointer"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
