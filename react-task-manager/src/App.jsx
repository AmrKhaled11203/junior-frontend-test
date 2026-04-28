import React from 'react';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="selection:bg-primary selection:text-black min-h-screen bg-surface">
      <TaskList />
    </div>
  );
}

export default App;
