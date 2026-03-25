'use client';

import { useState } from 'react';
import { Task, TaskType, TaskDifficulty, Subtask } from '@/types';
import { generateId, getXpReward, getCoinReward } from '@/lib/gamification';

interface CreateTaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  editTask?: Task | null;
}

export default function CreateTaskModal({ onClose, onSave, editTask }: CreateTaskModalProps) {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [type, setType] = useState<TaskType>(editTask?.type || 'todo');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(editTask?.difficulty || 'medium');
  const [dueDate, setDueDate] = useState(editTask?.dueDate || '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(editTask?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const xpReward = getXpReward(difficulty);
  const coinReward = getCoinReward(difficulty);

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: generateId(), title: newSubtask.trim(), isCompleted: false },
    ]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task: Task = {
      id: editTask?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      difficulty,
      status: editTask?.status || 'pending',
      xpReward,
      coinReward,
      subtasks,
      dueDate: dueDate || undefined,
      createdAt: editTask?.createdAt || new Date().toISOString(),
      completedAt: editTask?.completedAt,
    };

    onSave(task);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editTask ? '✏️ Edit Quest' : '⚔️ New Quest'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Quest Name *</label>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What quest will you embark on?"
              autoFocus
              required
              id="task-title-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about this quest..."
              rows={2}
              id="task-description-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Type + Difficulty Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="select"
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                id="task-type-select"
              >
                <option value="todo">📋 To-Do</option>
                <option value="daily">🔄 Daily</option>
                <option value="habit">💪 Habit</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                id="task-difficulty-select"
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              id="task-due-date-input"
            />
          </div>

          {/* Subtasks */}
          <div className="form-group">
            <label className="form-label">Sub-quests</label>
            <div className="subtask-input-row">
              <input
                className="input"
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a sub-quest..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                id="subtask-input"
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddSubtask}
                id="add-subtask-btn"
              >
                +
              </button>
            </div>
            {subtasks.length > 0 && (
              <ul className="subtask-list">
                {subtasks.map((st) => (
                  <li key={st.id} className="subtask-item">
                    <span>{st.title}</span>
                    <button
                      type="button"
                      className="subtask-remove"
                      onClick={() => handleRemoveSubtask(st.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reward Preview */}
          <div className="reward-preview">
            <span className="reward-preview-label">Rewards:</span>
            <span className="reward-preview-item">⚔️ {xpReward} XP</span>
            <span className="reward-preview-item">🪙 {coinReward} Gold</span>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" id="save-task-btn">
              {editTask ? 'Update Quest' : '🗡️ Create Quest'}
            </button>
          </div>
        </form>

        <style jsx>{`
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .modal-title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 700;
            background: linear-gradient(135deg, #8b5cf6, #38bdf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .modal-close {
            background: transparent;
            border: none;
            color: var(--color-text-muted);
            font-size: 1.1rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            transition: all 0.2s ease;
          }

          .modal-close:hover {
            color: var(--color-text-primary);
            background: var(--color-bg-tertiary);
          }

          .modal-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .form-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--color-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .subtask-input-row {
            display: flex;
            gap: 8px;
          }

          .subtask-input-row .btn-secondary {
            flex-shrink: 0;
            width: 40px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
          }

          .subtask-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 6px;
          }

          .subtask-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            background: var(--color-bg-tertiary);
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            color: var(--color-text-secondary);
          }

          .subtask-remove {
            background: transparent;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .subtask-remove:hover {
            color: var(--color-accent-rose);
            background: rgba(244, 63, 94, 0.1);
          }

          .reward-preview {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 16px;
            background: rgba(139, 92, 246, 0.08);
            border: 1px solid rgba(139, 92, 246, 0.15);
            border-radius: var(--radius-md);
          }

          .reward-preview-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--color-text-muted);
          }

          .reward-preview-item {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-text-accent);
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding-top: 8px;
            border-top: 1px solid var(--color-border-secondary);
          }
        `}</style>
      </div>
    </div>
  );
}
