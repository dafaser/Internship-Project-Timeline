import { Task } from '../types';

// Key for LocalStorage
const STORAGE_KEY_TASKS = 'megatrack_tasks';
const API_URL_KEY = 'megatrack_api_url';

export const getApiUrl = (): string | null => localStorage.getItem(API_URL_KEY);
export const setApiUrl = (url: string) => localStorage.setItem(API_URL_KEY, url);

// Helper to simulate network delay for local operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  // --- TASKS ---

  getTasks: async (month: string, week?: number, day?: string): Promise<Task[]> => {
    const apiUrl = getApiUrl();
    if (apiUrl) {
      try {
        // We use text/plain content type to ensure it's a "simple request" 
        // which avoids CORS preflight issues on some GAS deployments.
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ type: 'get_tasks' })
        });
        const data = await response.json();
        let tasks: Task[] = data.tasks || [];
        
        // Filter locally because GAS endpoint returns all (simplification)
        return tasks.filter(t => 
          t.month === month && 
          (week === undefined || t.week == week) && // weak equality for number/string mix safety
          (day === undefined || t.day === day)
        );
      } catch (e) {
        console.error("API Error, falling back to local", e);
      }
    }

    // Local Storage Fallback
    await delay(300);
    const allTasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    return allTasks.filter(t => 
      t.month === month && 
      (week === undefined || t.week === week) && 
      (day === undefined || t.day === day)
    );
  },

  saveTask: async (task: Task): Promise<void> => {
    const apiUrl = getApiUrl();
    if (apiUrl) {
      // Optimistic update locally first
      const allTasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
      const index = allTasks.findIndex(t => t.id === task.id);
      if (index >= 0) allTasks[index] = task;
      else allTasks.push(task);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(allTasks));

      // Send to API
      fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors', // Often needed for GAS web apps depending on setup
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ 
          type: index >= 0 ? 'update_task' : 'create_task', 
          payload: task 
        })
      }).catch(err => console.error("Sync failed", err));
      return;
    }

    // Local Only
    const allTasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const index = allTasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      allTasks[index] = task;
    } else {
      allTasks.push(task);
    }
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(allTasks));
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const apiUrl = getApiUrl();
    if (apiUrl) {
       fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'delete_task', payload: { id: taskId } })
      }).catch(err => console.error("Sync failed", err));
    }

    const allTasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');
    const newTasks = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(newTasks));
  }
};