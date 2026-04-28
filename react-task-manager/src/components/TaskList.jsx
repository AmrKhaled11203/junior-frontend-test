import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import TaskFilter from "./TaskFilter";
import logo from "../assets/logo.webp";
const TaskList = () => {
  const { tasks, filter } = useSelector((state) => state.tasks);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.priority === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col min-h-screen">
      {/* Assessment Header */}
      <header className="mb-12 flex items-center gap-6 border-b-8 border-black pb-8">
        
          <img src={logo} alt="LOGO" className="w-20 h-20" />
       
        <div>
          <h1 className="text-3xl sm:text-4xl font-black italic leading-none uppercase tracking-tight">
            Coding Assessment
          </h1>
          <div className="mt-2 inline-block bg-black text-white px-3 py-1 text-sm font-black uppercase tracking-widest border-2 border-black">
            FEKRA Solution Hub
          </div>
        </div>
      </header>

      <div className="flex-grow">
        <TaskForm
          taskToEdit={taskToEdit}
          onCancelEdit={() => setTaskToEdit(null)}
        />

        <div className="mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TaskFilter />
            <div className="font-black uppercase tracking-widest text-xs bg-secondary text-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {tasks.filter((t) => !t.completed).length} Tasks Left
            </div>
          </div>

          {sortedTasks.length > 0 ? (
            <div className="grid gap-4 animate-slide-up">
              {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={setTaskToEdit} />
              ))}
            </div>
          ) : (
            <div className="neo-card p-12 text-center bg-white">
              <p className="text-sm font-black uppercase text-black/40 tracking-widest italic">
                Flow is empty.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attribution Footer */}
      <footer className="mt-24 pt-8 border-t-8 border-black flex justify-center">
        <div className="neo-btn bg-primary text-white px-8 py-2 text-sm font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          CREATED BY AMR KHALED
        </div>
      </footer>
    </div>
  );
};

export default TaskList;
