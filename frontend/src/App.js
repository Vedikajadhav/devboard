import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask })
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT'
    });
    const updated = await res.json();
    setTasks(tasks.map(t => t._id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE'
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="app">
      <h1>📋 DevBoard</h1>
      <p className="subtitle">Task Manager by Vedika</p>
      <div className="input-box">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="tasks">
        {tasks.length === 0 && <p className="empty">No tasks yet! Add one above 🚀</p>}
        {tasks.map(task => (
          <div key={task._id} className={`task ${task.completed ? 'done' : ''}`}>
            <span onClick={() => toggleTask(task._id)}>{task.title}</span>
            <button onClick={() => deleteTask(task._id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
