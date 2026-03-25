import { Task, UserStats } from '@/types';
import { getDefaultUserStats } from '@/lib/gamification';

const TASKS_KEY = 'questify_tasks';
const STATS_KEY = 'questify_stats';

// =================== TASKS STORAGE ===================

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(task: Task): Task[] {
  const tasks = getTasks();
  tasks.unshift(task);
  saveTasks(tasks);
  return tasks;
}

export function updateTask(taskId: string, updates: Partial<Task>): Task[] {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
  }
  return tasks;
}

export function deleteTask(taskId: string): Task[] {
  const tasks = getTasks().filter((t) => t.id !== taskId);
  saveTasks(tasks);
  return tasks;
}

// =================== STATS STORAGE ===================

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') return getDefaultUserStats();
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : getDefaultUserStats();
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
