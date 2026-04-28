import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../redux/tasksSlice';

const TaskFilter = () => {
  const currentFilter = useSelector((state) => state.tasks.filter);
  const dispatch = useDispatch();

  const filters = ['All', 'High', 'Medium', 'Low'];

  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => dispatch(setFilter(filter))}
          className={`neo-btn text-xs px-6 py-2 ${
            currentFilter === filter 
              ? 'bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]' 
              : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
