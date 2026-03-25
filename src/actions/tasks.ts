'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { Task, Subtask } from '@/types';
import { revalidatePath } from 'next/cache';

async function getLocalUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');
  
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });
  
  if (!user) throw new Error('User not synchronized');
  return user.id;
}

export async function getTasksAction(): Promise<Task[]> {
  const userId = await getLocalUserId();
  
  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { subtasks: true },
    orderBy: { createdAt: 'desc' },
  });

  return tasks.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    type: task.type as any,
    difficulty: task.difficulty as any,
    status: task.status as any,
    xpReward: task.xpReward,
    coinReward: task.coinReward,
    dueDate: task.dueDate?.toISOString() || undefined,
    createdAt: task.createdAt.toISOString(),
    completedAt: task.completedAt?.toISOString() || undefined,
    subtasks: task.subtasks.map((st: any) => ({
      id: st.id,
      title: st.title,
      isCompleted: st.isCompleted,
    })),
  }));
}

export async function createTaskAction(taskData: Task) {
  const userId = await getLocalUserId();
  
  await prisma.task.create({
    data: {
      userId,
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      difficulty: taskData.difficulty,
      xpReward: taskData.xpReward,
      coinReward: taskData.coinReward,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      subtasks: {
        create: taskData.subtasks.map((st: any) => ({
          title: st.title,
          isCompleted: false,
        })),
      },
    },
  });

  revalidatePath('/dashboard/tasks');
}

export async function updateTaskAction(taskId: string, taskData: Partial<Task>) {
  const userId = await getLocalUserId();
  
  const task = await prisma.task.findUnique({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error('Task not found');

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      difficulty: taskData.difficulty,
      status: taskData.status,
      completedAt: taskData.completedAt ? new Date(taskData.completedAt) : null,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      subtasks: taskData.subtasks ? {
        deleteMany: {},
        create: taskData.subtasks.map((st: any) => ({
          title: st.title,
          isCompleted: st.isCompleted,
        })),
      } : undefined,
    },
  });

  revalidatePath('/dashboard/tasks');
}

export async function deleteTaskAction(taskId: string) {
  const userId = await getLocalUserId();
  
  await prisma.task.delete({
    where: { id: taskId, userId },
  });

  revalidatePath('/dashboard/tasks');
}
