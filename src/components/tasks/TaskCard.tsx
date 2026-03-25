'use client';

import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  index: number;
}

export default function TaskCard({ task, onComplete, onDelete, onEdit, index }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`task-card ${isCompleted ? 'task-completed' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Complete button */}
      <button
        className={`task-check ${isCompleted ? 'task-check-done' : ''}`}
        onClick={() => !isCompleted && onComplete(task.id)}
        disabled={isCompleted}
        aria-label={isCompleted ? 'Task completed' : 'Complete task'}
        id={`complete-task-${task.id}`}
      >
        {isCompleted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <div className="task-check-inner" />
        )}
      </button>

      {/* Task content */}
      <div className="task-content" onClick={() => !isCompleted && onEdit(task)}>
        <div className="task-title-row">
          <h3 className={`task-title ${isCompleted ? 'task-title-done' : ''}`}>
            {task.title}
          </h3>
          <div className="task-badges">
            <span className={`badge badge-${task.type}`}>{task.type}</span>
            <span className={`badge badge-${task.difficulty}`}>{task.difficulty}</span>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="task-subtasks">
            <div className="subtasks-progress">
              <div className="progress-bar" style={{ height: '3px' }}>
                <div
                  className="progress-bar-fill xp-bar-fill"
                  style={{
                    width: `${(task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100}%`,
                  }}
                />
              </div>
              <span className="subtasks-count">
                {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}
              </span>
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="task-rewards">
          <span className="reward-item tooltip" data-tooltip="XP reward">
            ⚔️ {task.xpReward} XP
          </span>
          <span className="reward-item tooltip" data-tooltip="Gold reward">
            🪙 {task.coinReward}
          </span>
          {task.dueDate && (
            <span className="reward-item due-date">
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        id={`delete-task-${task.id}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>

      <style jsx>{`
        .task-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.4s ease-out both;
          position: relative;
          overflow: hidden;
        }

        .task-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: ${task.difficulty === 'easy' ? 'var(--color-easy)' : task.difficulty === 'medium' ? 'var(--color-medium)' : 'var(--color-hard)'};
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .task-card:hover {
          background: var(--color-bg-card-hover);
          border-color: var(--color-border-primary);
          transform: translateX(4px);
        }

        .task-card:hover::before {
          opacity: 1;
        }

        .task-completed {
          opacity: 0.6;
        }

        .task-completed::before {
          background: var(--color-accent-emerald) !important;
        }

        .task-check {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--color-border-primary);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: transparent;
          margin-top: 2px;
        }

        .task-check:hover:not(:disabled) {
          border-color: var(--color-accent-emerald);
          background: rgba(16, 185, 129, 0.1);
          transform: scale(1.1);
        }

        .task-check-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: transparent;
          transition: all 0.2s ease;
        }

        .task-check:hover:not(:disabled) .task-check-inner {
          background: rgba(16, 185, 129, 0.4);
        }

        .task-check-done {
          background: var(--color-accent-emerald);
          border-color: var(--color-accent-emerald);
          color: white;
          cursor: default;
        }

        .task-content {
          flex: 1;
          min-width: 0;
          cursor: pointer;
        }

        .task-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .task-title {
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.4;
        }

        .task-title-done {
          text-decoration: line-through;
          color: var(--color-text-muted);
        }

        .task-badges {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        .task-description {
          margin-top: 6px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .task-subtasks {
          margin-top: 8px;
        }

        .subtasks-progress {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .subtasks-count {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        .task-rewards {
          display: flex;
          gap: 12px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .reward-item {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .due-date {
          color: var(--color-text-muted);
        }

        .task-delete {
          flex-shrink: 0;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
          opacity: 0;
        }

        .task-card:hover .task-delete {
          opacity: 1;
        }

        .task-delete:hover {
          color: var(--color-accent-rose);
          background: rgba(244, 63, 94, 0.1);
        }
      `}</style>
    </div>
  );
}
