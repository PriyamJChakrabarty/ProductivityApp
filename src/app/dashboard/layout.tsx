'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import StatsBar from '@/components/ui/StatsBar';
import ToastContainer from '@/components/ui/ToastContainer';
import { UserStats, Toast } from '@/types';
import { getUserStatsAction, updateUserStatsAction } from '@/actions/user';
import { getDefaultUserStats } from '@/lib/gamification';

// Create a simple event bus for cross-component communication
type StatsListener = (stats: UserStats) => void;
type ToastListener = (toast: Toast) => void;

const statsListeners: StatsListener[] = [];
const toastListeners: ToastListener[] = [];

export function emitStatsUpdate(stats: UserStats) {
  statsListeners.forEach((fn) => fn(stats));
}

export function emitToast(toast: Toast) {
  toastListeners.forEach((fn) => fn(toast));
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<UserStats>(getDefaultUserStats());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial fetch
    getUserStatsAction().then(initialStats => {
      if (initialStats) setStats(initialStats);
    });

    // Subscribe to events
    const statsHandler: StatsListener = (newStats) => {
      setStats(newStats);
      updateUserStatsAction(newStats);
    };
    const toastHandler: ToastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 3000);
    };

    statsListeners.push(statsHandler);
    toastListeners.push(toastHandler);

    return () => {
      const si = statsListeners.indexOf(statsHandler);
      if (si > -1) statsListeners.splice(si, 1);
      const ti = toastListeners.indexOf(toastHandler);
      if (ti > -1) toastListeners.splice(ti, 1);
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
      }}>
        <div style={{ fontSize: '2rem' }}>⚡</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <StatsBar stats={stats} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
        }

        .dashboard-main {
          flex: 1;
          margin-left: 240px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .dashboard-content {
          flex: 1;
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .dashboard-main {
            margin-left: 64px;
          }
          .dashboard-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
