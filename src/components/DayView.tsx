import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK, Task } from '../types';
import { storageService } from '../services/storage';
import { Plus, Trash2, CheckSquare, Square, Save, Loader2, Pencil, X, Check } from 'lucide-react';

interface DayViewProps {
  month: string;
  week: number;
}

export const DayView: React.FC<DayViewProps> = ({ month, week }) => {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Task Form State
  const [newTaskText, setNewTaskText] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Task['status']>('Not Started');

  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    loadTasks();
  }, [month, week, selectedDay]);

  const loadTasks = async () => {
    setLoading(true);
    const data = await storageService.getTasks(month, week, selectedDay);
    setTasks(data);
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      month,
      week,
      day: selectedDay,
      task: newTaskText,
      is_completed: false,
      status: status,
      notes: notes,
      created_at: new Date().toISOString()
    };

    setTasks([...tasks, newTask]); // Optimistic UI
    await storageService.saveTask(newTask);
    
    // Reset Form
    setNewTaskText('');
    setNotes('');
    setStatus('Not Started');
  };

  const handleToggleComplete = async (task: Task) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    await storageService.saveTask(updatedTask);
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    const updatedTask = { ...task, status: newStatus };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    await storageService.saveTask(updatedTask);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setTasks(tasks.filter(t => t.id !== taskId));
    await storageService.deleteTask(taskId);
  };

  const handleSaveNotes = async (task: Task) => {
    await storageService.saveTask(task);
  };

  // Edit Task Name Logic
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.task);
  };

  const saveEditing = async () => {
    if (!editingTaskId) return;
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      const updated = { ...task, task: editingText };
      setTasks(tasks.map(t => t.id === editingTaskId ? updated : t));
      await storageService.saveTask(updated);
    }
    setEditingTaskId(null);
    setEditingText('');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
      
      {/* Sidebar: Days */}
      <div className="w-full lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 flex-shrink-0 overflow-hidden flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
        {DAYS_OF_WEEK.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 lg:flex-none p-4 text-left transition-colors border-b lg:border-b-0 lg:border-l-4 whitespace-nowrap
              ${selectedDay === day 
                ? 'bg-orange-50 border-mega-yellow text-mega-yellow font-bold' 
                : 'border-transparent hover:bg-gray-50 text-gray-600'
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Main Content: Tasks */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-mega-dark">{selectedDay}</h2>
            <p className="text-sm text-gray-500">Task Management</p>
          </div>
          <div className="text-sm text-gray-400">
            {tasks.length} Tasks
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 text-mega-yellow animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No tasks for this day yet.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-3">
                  {/* Checklist */}
                  <button 
                    onClick={() => handleToggleComplete(task)}
                    className={`mt-1 flex-shrink-0 transition-colors ${task.is_completed ? 'text-green-500' : 'text-gray-300 hover:text-mega-yellow'}`}
                  >
                    {task.is_completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-1 space-y-3">
                    {/* Task Title & Controls */}
                    <div className="flex justify-between items-start min-h-[28px]">
                      {editingTaskId === task.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            type="text" 
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 border-b border-mega-yellow focus:outline-none bg-transparent text-lg font-medium text-mega-dark"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
                          />
                          <button onClick={saveEditing} className="text-green-600 hover:bg-green-50 p-1 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEditing} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className={`font-medium text-lg cursor-pointer ${task.is_completed ? 'line-through text-gray-400' : 'text-mega-dark'}`} onClick={() => startEditing(task)}>
                            {task.task}
                          </h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditing(task)}
                              className="text-gray-300 hover:text-mega-yellow hover:bg-orange-50 p-1 rounded transition-colors"
                              title="Edit Task"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(task.id)}
                              className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                        className={`text-xs font-bold px-2 py-1 rounded-full border bg-white cursor-pointer outline-none
                          ${task.status === 'Done' ? 'border-green-200 text-green-700 bg-green-50' : 
                            task.status === 'In Progress' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                            'border-gray-200 text-gray-600 bg-gray-50'}`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    
                    {/* Notes Area */}
                    <div className="relative">
                      <textarea 
                        className="w-full text-sm text-gray-600 bg-gray-50 rounded p-2 border border-transparent focus:bg-white focus:border-mega-yellow outline-none resize-none transition-all placeholder-gray-400 pr-8"
                        placeholder="Add notes..."
                        rows={2}
                        value={task.notes || ''}
                        onChange={(e) => {
                           const updatedTask = { ...task, notes: e.target.value };
                           setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
                        }}
                        onBlur={(e) => handleSaveNotes({ ...task, notes: e.target.value })}
                      />
                      <button 
                        onClick={() => handleSaveNotes(task)}
                        title="Save Notes"
                        className="absolute bottom-2 right-2 text-gray-400 hover:text-mega-yellow transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Area */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="What needs to be done?"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mega-yellow focus:border-mega-yellow outline-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-sm text-gray-500">
                {/* Could add quick toggles here if needed */}
              </div>
              <button 
                onClick={handleAddTask}
                disabled={!newTaskText.trim()}
                className="flex items-center gap-2 bg-mega-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};