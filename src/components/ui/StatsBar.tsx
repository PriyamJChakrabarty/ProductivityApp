'use client';

import { UserStats } from '@/types';

interface StatsBarProps {
  stats: UserStats;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const xpPercent = Math.round((stats.xp / stats.xpToNextLevel) * 100);
  const healthPercent = Math.round((stats.health / stats.maxHealth) * 100);
  const energyPercent = Math.round((stats.energy / stats.maxEnergy) * 100);

  return (
    <header className="stats-bar">
      <div className="stats-bar-inner">
        {/* Level Badge */}
        <div className="stat-group level-group">
          <div className="level-badge animate-pulse-glow">
            <span className="level-number">{stats.level}</span>
          </div>
          <div className="level-info">
            <span className="stat-label">Level {stats.level}</span>
            <div className="xp-bar-container">
              <div className="progress-bar" style={{ width: '120px', height: '6px' }}>
                <div
                  className="progress-bar-fill xp-bar-fill"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="xp-text">{stats.xp} / {stats.xpToNextLevel} XP</span>
            </div>
          </div>
        </div>

        {/* Stat Items */}
        <div className="stat-items">
          {/* Coins */}
          <div className="stat-item tooltip" data-tooltip={`${stats.coins} Gold`}>
            <span className="stat-icon">🪙</span>
            <span className="stat-value gold-value">{stats.coins}</span>
          </div>

          {/* Health */}
          <div className="stat-item tooltip" data-tooltip={`${stats.health}/${stats.maxHealth} HP`}>
            <span className="stat-icon">❤️</span>
            <div className="mini-bar">
              <div className="progress-bar" style={{ width: '60px', height: '4px' }}>
                <div
                  className="progress-bar-fill health-bar-fill"
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
              <span className="stat-value-sm">{stats.health}</span>
            </div>
          </div>

          {/* Energy */}
          <div className="stat-item tooltip" data-tooltip={`${stats.energy}/${stats.maxEnergy} Energy`}>
            <span className="stat-icon">⚡</span>
            <div className="mini-bar">
              <div className="progress-bar" style={{ width: '60px', height: '4px' }}>
                <div
                  className="progress-bar-fill energy-bar-fill"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
              <span className="stat-value-sm">{stats.energy}</span>
            </div>
          </div>

          {/* Streak */}
          <div className="stat-item tooltip" data-tooltip={`${stats.currentStreak} day streak`}>
            <span className="stat-icon">🔥</span>
            <span className="stat-value streak-value">{stats.currentStreak}</span>
          </div>

          {/* Tasks Completed */}
          <div className="stat-item tooltip" data-tooltip={`${stats.tasksCompleted} tasks completed`}>
            <span className="stat-icon">✅</span>
            <span className="stat-value">{stats.tasksCompleted}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-bar {
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border-secondary);
          padding: 14px 24px;
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(12px);
        }

        .stats-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .stat-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .level-badge {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 50%;
          border: 2px solid rgba(139, 92, 246, 0.5);
        }

        .level-number {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
        }

        .level-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .xp-bar-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .xp-text {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
          white-space: nowrap;
        }

        .stat-items {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: var(--radius-md);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-secondary);
          transition: all 0.2s ease;
        }

        .stat-item:hover {
          border-color: var(--color-border-primary);
          transform: translateY(-1px);
        }

        .stat-icon {
          font-size: 0.9rem;
        }

        .stat-value {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .stat-value-sm {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          min-width: 20px;
        }

        .gold-value {
          color: var(--color-accent-gold);
        }

        .streak-value {
          color: var(--color-accent-rose);
        }

        .mini-bar {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .stats-bar {
            padding: 10px 12px;
          }
          .stat-items {
            gap: 8px;
          }
          .stat-item {
            padding: 4px 8px;
          }
          .mini-bar .progress-bar {
            display: none;
          }
          .xp-bar-container .progress-bar {
            width: 80px !important;
          }
        }
      `}</style>
    </header>
  );
}
