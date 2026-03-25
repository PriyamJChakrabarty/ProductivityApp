import { UserStats, Task, RewardResult, TaskDifficulty } from '@/types';

// =================== XP / LEVEL CONSTANTS ===================

const BASE_XP = 100;
const SCALING_FACTOR = 1.5;

const XP_REWARDS: Record<TaskDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

const COIN_REWARDS: Record<TaskDifficulty, number> = {
  easy: 5,
  medium: 15,
  hard: 30,
};

// =================== LEVEL CALCULATIONS ===================

export function calculateXpToNextLevel(level: number): number {
  return Math.floor(BASE_XP * Math.pow(level, SCALING_FACTOR));
}

export function getXpReward(difficulty: TaskDifficulty): number {
  return XP_REWARDS[difficulty];
}

export function getCoinReward(difficulty: TaskDifficulty): number {
  return COIN_REWARDS[difficulty];
}

// =================== STREAK LOGIC ===================

function isSameDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

// =================== PROCESS TASK COMPLETION ===================

export function processTaskCompletion(
  stats: UserStats,
  task: Task
): { updatedStats: UserStats; reward: RewardResult } {
  const now = new Date().toISOString();
  const xpGained = task.xpReward;
  const coinsGained = task.coinReward;

  let bonusXp = 0;
  let bonusReason = '';

  // Streak bonus
  let newStreak = stats.currentStreak;
  if (stats.lastCompletedAt) {
    if (isSameDay(stats.lastCompletedAt, now)) {
      // Already completed today, streak stays
    } else if (isYesterday(stats.lastCompletedAt)) {
      newStreak += 1;
      if (newStreak >= 7) {
        bonusXp += 20;
        bonusReason = '🔥 7-day streak bonus!';
      } else if (newStreak >= 3) {
        bonusXp += 10;
        bonusReason = '🔥 Streak bonus!';
      }
    } else {
      newStreak = 1; // Streak broken
    }
  } else {
    newStreak = 1;
  }

  const totalXpGain = xpGained + bonusXp;
  let newXp = stats.xp + totalXpGain;
  let newLevel = stats.level;
  let newXpToNext = stats.xpToNextLevel;
  let leveledUp = false;

  // Check level up
  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel += 1;
    newXpToNext = calculateXpToNextLevel(newLevel);
    leveledUp = true;
  }

  const updatedStats: UserStats = {
    ...stats,
    xp: newXp,
    level: newLevel,
    xpToNextLevel: newXpToNext,
    totalXp: stats.totalXp + totalXpGain,
    coins: stats.coins + coinsGained,
    tasksCompleted: stats.tasksCompleted + 1,
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    lastCompletedAt: now,
    // Restore a bit of health on completion
    health: Math.min(stats.maxHealth, stats.health + 5),
    // Use a bit of energy
    energy: Math.max(0, stats.energy - 3),
  };

  const reward: RewardResult = {
    xpGained,
    coinsGained,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    bonusXp: bonusXp > 0 ? bonusXp : undefined,
    bonusReason: bonusReason || undefined,
  };

  return { updatedStats, reward };
}

// =================== DEFAULT USER STATS ===================

export function getDefaultUserStats(): UserStats {
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: calculateXpToNextLevel(1),
    totalXp: 0,
    coins: 0,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    tasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedAt: null,
  };
}

// =================== GENERATE ID ===================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
