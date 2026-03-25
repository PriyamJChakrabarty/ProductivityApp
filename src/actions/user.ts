'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { getDefaultUserStats } from '@/lib/gamification';
import { UserStats } from '@/types';
import { revalidatePath } from 'next/cache';

// Sync Clerk user with local DB and return local user with stats
export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  // Find or create local user
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { stats: true },
  });

  if (!user) {
    const defaultStats = getDefaultUserStats();
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: email,
        username: clerkUser.username || clerkUser.firstName,
        stats: {
          create: {
            level: defaultStats.level,
            xp: defaultStats.xp,
            xpToNextLevel: defaultStats.xpToNextLevel,
            totalXp: defaultStats.totalXp,
            coins: defaultStats.coins,
            health: defaultStats.health,
            maxHealth: defaultStats.maxHealth,
            energy: defaultStats.energy,
            maxEnergy: defaultStats.maxEnergy,
            currentStreak: defaultStats.currentStreak,
            longestStreak: defaultStats.longestStreak,
            tasksCompleted: defaultStats.tasksCompleted,
          },
        },
      },
      include: { stats: true },
    });
  }

  return user;
}

export async function getUserStatsAction(): Promise<UserStats | null> {
  const user = await syncUser();
  if (!user || !user.stats) return null;

  // Map to our frontend UserStats type
  return {
    ...user.stats,
    lastCompletedAt: user.stats.lastCompletedAt?.toISOString() || undefined,
  } as UserStats;
}

export async function updateUserStatsAction(stats: UserStats) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error('User not found');

  return await prisma.userStats.update({
    where: { userId: user.id },
    data: {
      level: stats.level,
      xp: stats.xp,
      xpToNextLevel: stats.xpToNextLevel,
      totalXp: stats.totalXp,
      coins: stats.coins,
      health: stats.health,
      maxHealth: stats.maxHealth,
      energy: stats.energy,
      maxEnergy: stats.maxEnergy,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      lastCompletedAt: stats.lastCompletedAt ? new Date(stats.lastCompletedAt) : null,
      tasksCompleted: stats.tasksCompleted,
    },
  });
}

export async function getUserProfileAction() {
  const { userId } = await auth();
  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      displayName: true,
      favoriteMonster: true,
      username: true,
    },
  });
}

export async function updateProfileAction(data: { displayName?: string, favoriteMonster?: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const result = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      displayName: data.displayName,
      favoriteMonster: data.favoriteMonster,
    },
  });

  revalidatePath('/dashboard');
  return result;
}
