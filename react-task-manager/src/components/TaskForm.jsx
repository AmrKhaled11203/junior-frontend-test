import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, editTask } from '../redux/tasksSlice';

const TaskForm = ({ taskToEdit, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPriority(taskToEdit.priority);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      dispatch(editTask({ id: taskToEdit.id, title, priority }));
      onCancelEdit();
    } else {
      dispatch(addTask({
        id: crypto.randomUUID(),
        title,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      }));
    }

    setTitle('');
    setPriority('Medium');
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-6 bg-white border-b-[12px] border-black">
      <div className="flex flex-col sm:flex-row items-end gap-6">
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] mb-2">New Entry</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="TASK DESCRIPTION..."
            className="neo-input !py-2"
            autoFocus
          />
        </div>
        
        <div className="w-full sm:w-48">
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] mb-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="neo-input !py-2 cursor-pointer"
          >
            <option value="High">HIGH</option>
            <option value="Medium">MEDIUM</option>
            <option value="Low">LOW</option>
          </select>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button type="submit" className="neo-btn neo-btn-primary !py-2 px-8">
            {taskToEdit ? 'SAVE' : 'ADD'}
          </button>
          {taskToEdit && (
            <button type="button" onClick={onCancelEdit} className="neo-btn bg-white !py-2 px-6">
              X
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
