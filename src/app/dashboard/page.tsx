'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { UserStats, Task } from '@/types';
import { getTasksAction } from '@/actions/tasks';
import { getUserStatsAction, syncUser, updateProfileAction, getUserProfileAction } from '@/actions/user';
import { getDefaultUserStats } from '@/lib/gamification';
import { emitToast } from './layout';
import { generateId } from '@/lib/gamification';

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>(getDefaultUserStats());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<{ displayName: string, favoriteMonster: string }>({ displayName: '', favoriteMonster: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      await syncUser();
      const [s, t, p] = await Promise.all([
        getUserStatsAction(),
        getTasksAction(),
        getUserProfileAction()
      ]);
      if (s) setStats(s);
      setTasks(t);
      if (p) setProfile({ 
        displayName: p.displayName || '', 
        favoriteMonster: p.favoriteMonster || '' 
      });
    };

    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfileAction(profile);
      emitToast({
        id: generateId(),
        type: 'info',
        message: 'Legend status updated!',
        icon: '📜'
      });
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

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

      {/* Recent Activity & Profile Test */}
      <div className="dashboard-footer-grid">
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

        {/* Profile Test UI */}
        <section className="profile-test-section animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="section-title">👤 Legend & Lore (Test DB)</h2>
          <div className="profile-card">
            <p className="profile-desc">Update these fields to test your Neon DB persistence.</p>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Hero Name</label>
                <input 
                  type="text" 
                  value={profile.displayName}
                  onChange={(e) => setProfile(p => ({ ...p, displayName: e.target.value }))}
                  placeholder="e.g. Sir Productive"
                />
              </div>
              <div className="form-group">
                <label>Favorite Monster</label>
                <input 
                  type="text" 
                  value={profile.favoriteMonster}
                  onChange={(e) => setProfile(p => ({ ...p, favoriteMonster: e.target.value }))}
                  placeholder="e.g. Procrastination Slime"
                />
              </div>
              <button disabled={isUpdating} className="btn-primary update-btn" type="submit">
                {isUpdating ? 'Saving...' : 'Save to Neon DB'}
              </button>
            </form>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard-footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
          margin-bottom: 28px;
        }

        .profile-card {
          padding: 24px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
        }

        .profile-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 600;
          text-transform: uppercase;
        }

        .form-group input {
          width: 100%;
          padding: 10px 14px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          border-color: var(--color-accent-primary);
        }

        .update-btn {
          margin-top: 8px;
          padding: 12px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
