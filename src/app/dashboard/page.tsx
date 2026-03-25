'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { UserStats, Task } from '@/types';
import { getTasksAction } from '@/actions/tasks';
import { getUserStatsAction, syncUser } from '@/actions/user';
import { getDefaultUserStats } from '@/lib/gamification';

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>(getDefaultUserStats());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      await syncUser();
      const s = await getUserStatsAction();
      const t = await getTasksAction();
      if (s) setStats(s);
      setTasks(t);
    };

    loadData();
  }, []);

  if (!mounted) return null;

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedToday = tasks.filter(
    (t) =>
      t.status === 'completed' &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === new Date().toDateString()
  );

  const xpPercent = Math.round((stats.xp / stats.xpToNextLevel) * 100);

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <section className="welcome-section animate-fade-in">
        <div className="welcome-text">
          <h1 className="welcome-title">
            Welcome back, <span className="welcome-name">{user?.firstName || 'Adventurer'}</span> 👋
          </h1>
          <p className="welcome-subtitle">
            {pendingTasks.length > 0
              ? `You have ${pendingTasks.length} quest${pendingTasks.length > 1 ? 's' : ''} waiting. Let's earn some XP!`
              : 'Create your first quest to begin your adventure!'}
          </p>
        </div>
      </section>

      {/* Stats Overview Cards */}
      <section className="stats-grid">
        <div className="stat-card level-card animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-icon">🏰</div>
          <div className="stat-card-content">
            <span className="stat-card-label">Level</span>
            <span className="stat-card-value">{stats.level}</span>
            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div className="progress-bar-fill xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="stat-card-detail">{stats.xp}/{stats.xpToNextLevel} XP</span>
          </div>
        </div>

        <div className="stat-card gold-card animate-slide-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="stat-card-icon">🪙</div>
          <div className="stat-card-content">
            <span className="stat-card-label">Gold</span>
            <span className="stat-card-value gold-text">{stats.coins}</span>
            <span className="stat-card-detail">Total earned</span>
          </div>
        </div>

        <div className="stat-card streak-card animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card-icon">🔥</div>
          <div className="stat-card-content">
            <span className="stat-card-label">Streak</span>
            <span className="stat-card-value streak-text">{stats.currentStreak}</span>
            <span className="stat-card-detail">Best: {stats.longestStreak} days</span>
          </div>
        </div>

        <div className="stat-card quests-card animate-slide-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="stat-card-icon">⚔️</div>
          <div className="stat-card-content">
            <span className="stat-card-label">Quests Done</span>
            <span className="stat-card-value">{stats.tasksCompleted}</span>
            <span className="stat-card-detail">{completedToday.length} today</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="actions-grid">
          <Link href="/dashboard/tasks" className="action-card">
            <span className="action-icon">⚔️</span>
            <span className="action-label">View Quests</span>
            <span className="action-count">{pendingTasks.length} pending</span>
          </Link>
          <Link href="/dashboard/stats" className="action-card">
            <span className="action-icon">📊</span>
            <span className="action-label">View Stats</span>
            <span className="action-count">Analytics</span>
          </Link>
          <Link href="/dashboard/skills" className="action-card">
            <span className="action-icon">🌟</span>
            <span className="action-label">Skill Tree</span>
            <span className="action-count">Coming soon</span>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      {completedToday.length > 0 && (
        <section className="recent-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title">🏆 Today&apos;s Conquests</h2>
          <div className="recent-list">
            {completedToday.slice(0, 5).map((task) => (
              <div key={task.id} className="recent-item">
                <span className="recent-check">✅</span>
                <span className="recent-title">{task.title}</span>
                <span className="recent-reward">+{task.xpReward} XP</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .dashboard-home {
          max-width: 960px;
          margin: 0 auto;
        }

        .welcome-section {
          margin-bottom: 28px;
        }

        .welcome-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 6px;
        }

        .welcome-name {
          background: linear-gradient(135deg, #8b5cf6, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 0.925rem;
          color: var(--color-text-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }

        .stat-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: var(--color-border-primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-glow-purple);
        }

        .stat-card-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .stat-card-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .stat-card-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .stat-card-value {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.2;
        }

        .gold-text {
          color: var(--color-accent-gold);
        }

        .streak-text {
          color: var(--color-accent-rose);
        }

        .stat-card-detail {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-top: 4px;
          font-family: var(--font-mono);
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 14px;
        }

        .quick-actions {
          margin-bottom: 28px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 16px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .action-card:hover {
          background: var(--color-bg-card-hover);
          border-color: var(--color-border-primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-glow-purple);
        }

        .action-icon {
          font-size: 2rem;
        }

        .action-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-primary);
        }

        .action-count {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        .recent-section {
          margin-bottom: 28px;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-md);
        }

        .recent-check {
          font-size: 0.9rem;
        }

        .recent-title {
          flex: 1;
          font-size: 0.875rem;
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .recent-reward {
          font-size: 0.8rem;
          color: var(--color-accent-primary);
          font-weight: 600;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
