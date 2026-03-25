'use client';

import { useState, useEffect } from 'react';
import { UserStats, Task } from '@/types';
import { getTasksAction } from '@/actions/tasks';
import { getUserStatsAction } from '@/actions/user';
import { getDefaultUserStats } from '@/lib/gamification';

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats>(getDefaultUserStats());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getUserStatsAction().then(s => { if (s) setStats(s); });
    getTasksAction().then(setTasks);
  }, []);

  if (!mounted) return null;

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');

  const easyDone = completedTasks.filter((t) => t.difficulty === 'easy').length;
  const mediumDone = completedTasks.filter((t) => t.difficulty === 'medium').length;
  const hardDone = completedTasks.filter((t) => t.difficulty === 'hard').length;

  const todoDone = completedTasks.filter((t) => t.type === 'todo').length;
  const dailyDone = completedTasks.filter((t) => t.type === 'daily').length;
  const habitDone = completedTasks.filter((t) => t.type === 'habit').length;

  const totalXpPossible = tasks.reduce((acc, t) => acc + t.xpReward, 0);
  const xpEarned = completedTasks.reduce((acc, t) => acc + t.xpReward, 0);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const xpPercent = Math.round((stats.xp / stats.xpToNextLevel) * 100);
  const healthPercent = Math.round((stats.health / stats.maxHealth) * 100);
  const energyPercent = Math.round((stats.energy / stats.maxEnergy) * 100);

  return (
    <div className="stats-page">
      <h1 className="page-title animate-fade-in">📊 Adventure Stats</h1>
      <p className="page-subtitle animate-fade-in">Track your quest progress and growth.</p>

      {/* Character Overview */}
      <section className="stats-section animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="section-heading">🏰 Character Overview</h2>
        <div className="character-grid">
          {/* Level & XP */}
          <div className="char-card">
            <div className="char-card-header">
              <span className="char-icon">⭐</span>
              <span className="char-label">Level</span>
            </div>
            <span className="char-value">{stats.level}</span>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div className="progress-bar-fill xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="char-detail">{stats.xp} / {stats.xpToNextLevel} XP ({xpPercent}%)</span>
          </div>

          {/* Total XP */}
          <div className="char-card">
            <div className="char-card-header">
              <span className="char-icon">⚔️</span>
              <span className="char-label">Total XP</span>
            </div>
            <span className="char-value purple-text">{stats.totalXp}</span>
            <span className="char-detail">Lifetime experience</span>
          </div>

          {/* Gold */}
          <div className="char-card">
            <div className="char-card-header">
              <span className="char-icon">🪙</span>
              <span className="char-label">Gold</span>
            </div>
            <span className="char-value gold-text">{stats.coins}</span>
            <span className="char-detail">Spend in the Skill Tree</span>
          </div>

          {/* Health */}
          <div className="char-card">
            <div className="char-card-header">
              <span className="char-icon">❤️</span>
              <span className="char-label">Health</span>
            </div>
            <span className="char-value rose-text">{stats.health}/{stats.maxHealth}</span>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div className="progress-bar-fill health-bar-fill" style={{ width: `${healthPercent}%` }} />
            </div>
          </div>

          {/* Energy */}
          <div className="char-card">
            <div className="char-card-header">
              <span className="char-icon">⚡</span>
              <span className="char-label">Energy</span>
            </div>
            <span className="char-value cyan-text">{stats.energy}/{stats.maxEnergy}</span>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div className="progress-bar-fill energy-bar-fill" style={{ width: `${energyPercent}%` }} />
            </div>
          </div>

          {/* Streak */}
          <div className="char-card">
            <div className="char-card-header">
              <span className="char-icon">🔥</span>
              <span className="char-label">Streak</span>
            </div>
            <span className="char-value">{stats.currentStreak} days</span>
            <span className="char-detail">Best: {stats.longestStreak} days</span>
          </div>
        </div>
      </section>

      {/* Quest Analytics */}
      <section className="stats-section animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="section-heading">⚔️ Quest Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <span className="analytics-label">Total Quests</span>
            <span className="analytics-value">{tasks.length}</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">Completed</span>
            <span className="analytics-value emerald-text">{completedTasks.length}</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">Pending</span>
            <span className="analytics-value amber-text">{pendingTasks.length}</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">Completion Rate</span>
            <span className="analytics-value">{completionRate}%</span>
          </div>
        </div>
      </section>

      {/* Difficulty Breakdown */}
      <section className="stats-section animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-heading">🎯 Difficulty Breakdown</h2>
        <div className="breakdown-grid">
          <div className="breakdown-row">
            <span className="breakdown-label">
              <span className="dot dot-easy" /> Easy
            </span>
            <div className="breakdown-bar">
              <div
                className="breakdown-fill fill-easy"
                style={{ width: `${completedTasks.length > 0 ? (easyDone / completedTasks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="breakdown-count">{easyDone}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">
              <span className="dot dot-medium" /> Medium
            </span>
            <div className="breakdown-bar">
              <div
                className="breakdown-fill fill-medium"
                style={{ width: `${completedTasks.length > 0 ? (mediumDone / completedTasks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="breakdown-count">{mediumDone}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">
              <span className="dot dot-hard" /> Hard
            </span>
            <div className="breakdown-bar">
              <div
                className="breakdown-fill fill-hard"
                style={{ width: `${completedTasks.length > 0 ? (hardDone / completedTasks.length) * 100 : 0}%` }}
              />
            </div>
            <span className="breakdown-count">{hardDone}</span>
          </div>
        </div>
      </section>

      {/* Type Breakdown */}
      <section className="stats-section animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="section-heading">📋 Quest Types</h2>
        <div className="type-grid">
          <div className="type-card">
            <span className="type-icon">📋</span>
            <span className="type-label">To-Do</span>
            <span className="type-count">{todoDone} done</span>
          </div>
          <div className="type-card">
            <span className="type-icon">🔄</span>
            <span className="type-label">Daily</span>
            <span className="type-count">{dailyDone} done</span>
          </div>
          <div className="type-card">
            <span className="type-icon">💪</span>
            <span className="type-label">Habit</span>
            <span className="type-count">{habitDone} done</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .stats-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin-bottom: 28px;
        }

        .stats-section {
          margin-bottom: 28px;
        }

        .section-heading {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 14px;
        }

        .character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px;
        }

        .char-card {
          padding: 18px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .char-card:hover {
          border-color: var(--color-border-primary);
          transform: translateY(-2px);
        }

        .char-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .char-icon {
          font-size: 1rem;
        }

        .char-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .char-value {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .char-detail {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-top: 4px;
          font-family: var(--font-mono);
        }

        .purple-text { color: var(--color-accent-primary); }
        .gold-text { color: var(--color-accent-gold); }
        .rose-text { color: var(--color-accent-rose); }
        .cyan-text { color: var(--color-accent-cyan); }
        .emerald-text { color: var(--color-accent-emerald); }
        .amber-text { color: var(--color-accent-gold); }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .analytics-card {
          padding: 18px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .analytics-card:hover {
          border-color: var(--color-border-primary);
          transform: translateY(-2px);
        }

        .analytics-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .analytics-value {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .breakdown-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
        }

        .breakdown-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .breakdown-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          min-width: 80px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-easy { background: var(--color-easy); }
        .dot-medium { background: var(--color-medium); }
        .dot-hard { background: var(--color-hard); }

        .breakdown-bar {
          flex: 1;
          height: 8px;
          background: var(--color-bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
        }

        .breakdown-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s ease;
        }

        .fill-easy { background: var(--color-easy); }
        .fill-medium { background: var(--color-medium); }
        .fill-hard { background: var(--color-hard); }

        .breakdown-count {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-primary);
          min-width: 20px;
          text-align: right;
        }

        .type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .type-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 16px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
        }

        .type-card:hover {
          border-color: var(--color-border-primary);
          transform: translateY(-2px);
        }

        .type-icon {
          font-size: 1.8rem;
        }

        .type-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-primary);
        }

        .type-count {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
