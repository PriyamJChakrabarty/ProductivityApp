'use client';

import { Task, FilterType } from '@/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, filter, onComplete, onDelete, onEdit }: TaskListProps) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {filter === 'completed' ? '🏆' : '⚔️'}
        </div>
        <h3 className="empty-title">
          {filter === 'completed'
            ? 'No quests completed yet'
            : 'No quests available'}
        </h3>
        <p className="empty-description">
          {filter === 'completed'
            ? 'Complete some quests to see them here!'
            : 'Create your first quest to begin your adventure!'}
        </p>

        <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
          }

          .empty-icon {
            font-size: 3rem;
            margin-bottom: 16px;
            animation: float 3s ease-in-out infinite;
          }

          .empty-title {
            font-family: var(--font-display);
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--color-text-primary);
            margin-bottom: 8px;
          }

          .empty-description {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            max-width: 320px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="task-list">
      {filteredTasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          index={index}
        />
      ))}

      <style jsx>{`
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
