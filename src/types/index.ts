// =================== TASK TYPES ===================

export type TaskType = 'todo' | 'daily' | 'habit';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'completed';
export type FilterType = 'all' | 'pending' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  xpReward: number;
  coinReward: number;
  subtasks: Subtask[];
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

// =================== USER / GAME TYPES ===================

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  coins: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: string | null;
}

export interface UserProfile {
  displayName?: string;
  favoriteMonster?: string;
  username?: string;
}


// =================== NOTIFICATION / TOAST TYPES ===================

export type ToastType = 'xp' | 'gold' | 'level' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  icon?: string;
  duration?: number;
}

// =================== REWARD RESULT ===================

export interface RewardResult {
  xpGained: number;
  coinsGained: number;
  leveledUp: boolean;
  newLevel?: number;
  bonusXp?: number;
  bonusReason?: string;
}
