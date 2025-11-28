import { Task } from '../types';

// Key for LocalStorage (Base key, will be appended with email)
const BASE_STORAGE_KEY_TASKS = 'megatrack_tasks_';
const API_URL_KEY = 'megatrack_api_url';

export const getApiUrl = (): string | null => localStorage.getItem(API_URL_KEY);
export const setApiUrl = (url: string) => localStorage.setItem(API_URL_KEY, url);

// Helper to get user-specific storage key
const getUserStorageKey = (email: string) => `${BASE_STORAGE_KEY_TASKS}${email}`;

// Helper to simulate network delay for local operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  // --- TASKS ---

  getTasks: async (month: string, week?: number, day?: string, userEmail?: string): Promise<Task[]> => {
    if (!userEmail) return []; // Security guard: need email to fetch specific data

    const apiUrl = getApiUrl();
    if (apiUrl) {
      try {
        // We use text/plain content type to ensure it's a "simple request" 
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ 
            type: 'get_tasks',
            payload: { user_email: userEmail } // Request data specifically for this user
          })
        });
        const data = await response.json();
        let tasks: Task[] = data.tasks || [];
        
        // Additional client-side filter for safety
        return tasks.filter(t => 
          t.month === month && 
          (week === undefined || t.week == week) && 
          (day === undefined || t.day === day)
        );
      } catch (e) {
        console.error("API Error, falling back to local", e);
      }
    }

    // Local Storage Fallback (User Specific)
    await delay(300);
    const storageKey = getUserStorageKey(userEmail);
    const allTasks: Task[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    return allTasks.filter(t => 
      t.month === month && 
      (week === undefined || t.week === week) && 
      (day === undefined || t.day === day)
    );
  },

  saveTask: async (task: Task, userEmail?: string): Promise<void> => {
    if (!userEmail) {
      console.error("Cannot save task without user email");
      return;
    }

    const taskToSave = { ...task, user_email: userEmail };
    const apiUrl = getApiUrl();
    const storageKey = getUserStorageKey(userEmail);

    if (apiUrl) {
      // Optimistic update locally first
      const allTasks: Task[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = allTasks.findIndex(t => t.id === task.id);
      if (index >= 0) allTasks[index] = taskToSave;
      else allTasks.push(taskToSave);
      localStorage.setItem(storageKey, JSON.stringify(allTasks));

      // Send to API
      fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ 
          type: index >= 0 ? 'update_task' : 'create_task', 
          payload: taskToSave 
        })
      }).catch(err => console.error("Sync failed", err));
      return;
    }

    // Local Only
    const allTasks: Task[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const index = allTasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      allTasks[index] = taskToSave;
    } else {
      allTasks.push(taskToSave);
    }
    localStorage.setItem(storageKey, JSON.stringify(allTasks));
  },

  deleteTask: async (taskId: string, userEmail?: string): Promise<void> => {
    if (!userEmail) return;

    const apiUrl = getApiUrl();
    const storageKey = getUserStorageKey(userEmail);

    if (apiUrl) {
       fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ 
          type: 'delete_task', 
          payload: { id: taskId, user_email: userEmail } // Pass email for validation if needed in future
        })
      }).catch(err => console.error("Sync failed", err));
    }

    const allTasks: Task[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newTasks = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(storageKey, JSON.stringify(newTasks));
  }
};