'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, FilterType } from '@/types';
import { getTasksAction, createTaskAction, updateTaskAction, deleteTaskAction } from '@/actions/tasks';
import { getUserStatsAction, updateUserStatsAction } from '@/actions/user';
import { processTaskCompletion, generateId } from '@/lib/gamification';
import { emitStatsUpdate, emitToast } from '../layout';
import TaskList from '@/components/tasks/TaskList';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getTasksAction().then(setTasks);
  }, []);

  const handleSaveTask = useCallback(async (task: Task) => {
    if (editingTask) {
      await updateTaskAction(task.id, task);
    } else {
      await createTaskAction(task);
    }

    const updated = await getTasksAction();
    setTasks(updated);
    setShowCreateModal(false);
    setEditingTask(null);
  }, [editingTask]);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'completed') return;

    // Mark task completed in DB
    const now = new Date().toISOString();
    await updateTaskAction(taskId, {
      status: 'completed',
      completedAt: now,
    });
    
    const updatedTasks = await getTasksAction();
    setTasks(updatedTasks);

    // Process gamification
    const stats = await getUserStatsAction();
    if (!stats) return;
    
    const { updatedStats, reward } = processTaskCompletion(stats, task);

    // Save stats to DB and emit
    await updateUserStatsAction(updatedStats);
    emitStatsUpdate(updatedStats);

    // Show reward toasts
    emitToast({
      id: generateId(),
      type: 'xp',
      message: `+${reward.xpGained} XP earned!`,
      icon: '⚔️',
    });

    if (reward.coinsGained > 0) {
      setTimeout(() => {
        emitToast({
          id: generateId(),
          type: 'gold',
          message: `+${reward.coinsGained} Gold earned!`,
          icon: '🪙',
        });
      }, 300);
    }

    if (reward.bonusXp && reward.bonusReason) {
      setTimeout(() => {
        emitToast({
          id: generateId(),
          type: 'xp',
          message: `+${reward.bonusXp} bonus XP — ${reward.bonusReason}`,
          icon: '🔥',
        });
      }, 600);
    }

    if (reward.leveledUp) {
      setTimeout(() => {
        emitToast({
          id: generateId(),
          type: 'level',
          message: `🎉 LEVEL UP! You reached Level ${reward.newLevel}!`,
          icon: '🏆',
          duration: 5000,
        });
      }, 900);
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    await deleteTaskAction(taskId);
    const updated = await getTasksAction();
    setTasks(updated);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  }, []);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: tasks.length },
    { key: 'pending', label: 'Active', count: tasks.filter((t) => t.status === 'pending').length },
    { key: 'completed', label: 'Done', count: tasks.filter((t) => t.status === 'completed').length },
  ];

  if (!mounted) return null;

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header animate-fade-in">
        <div className="tasks-header-text">
          <h1 className="tasks-title">⚔️ Quest Board</h1>
          <p className="tasks-subtitle">
            Complete quests to earn XP and gold. Harder quests = bigger rewards.
          </p>
        </div>
        <button
          className="btn-primary create-btn"
          onClick={() => {
            setEditingTask(null);
            setShowCreateModal(true);
          }}
          id="create-task-btn"
        >
          <span>+ New Quest</span>
        </button>
      </div>

      {/* Filters */}
      <div className="tasks-filters animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'filter-active' : ''}`}
            onClick={() => setFilter(f.key)}
            id={`filter-${f.key}`}
          >
            {f.label}
            <span className="filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="tasks-list-container" style={{ animationDelay: '0.15s' }}>
        <TaskList
          tasks={tasks}
          filter={filter}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
      </div>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          editTask={editingTask}
        />
      )}

      <style jsx>{`
        .tasks-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .tasks-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tasks-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }

        .tasks-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .tasks-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          padding: 4px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-secondary);
          width: fit-content;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-sans);
        }

        .filter-btn:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-tertiary);
        }

        .filter-active {
          background: var(--color-accent-primary);
          color: white;
        }

        .filter-active:hover {
          background: var(--color-accent-primary);
          color: white;
        }

        .filter-count {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 1px 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.15);
        }

        .filter-active .filter-count {
          background: rgba(255, 255, 255, 0.25);
        }

        .tasks-list-container {
          animation: fadeIn 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}
