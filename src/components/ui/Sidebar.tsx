'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/tasks', label: 'Tasks', icon: '⚔️' },
  { href: '/dashboard/stats', label: 'Stats', icon: '📊' },
  { href: '/dashboard/skills', label: 'Skills', icon: '🌟' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Questify</span>
        </div>
        <p className="sidebar-tagline">Level up your life</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
              {isActive && <span className="sidebar-active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 32, height: 32 },
              },
            }}
          />
          <div className="sidebar-user-info">
            <span className="sidebar-username">
              {user?.firstName || 'Adventurer'}
            </span>
            <span className="sidebar-email">
              {user?.primaryEmailAddress?.emailAddress || ''}
            </span>
          </div>
        </div>
        <div className="sidebar-version">v0.1.0 • Phase 1</div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border-secondary);
          display: flex;
          flex-direction: column;
          padding: 0;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
        }

        .sidebar-brand {
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--color-border-secondary);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #6366f1, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-tagline {
          margin-top: 4px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
        }

        .sidebar-link:hover {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .sidebar-link-active {
          background: rgba(139, 92, 246, 0.1);
          color: var(--color-accent-primary);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .sidebar-link-icon {
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
        }

        .sidebar-active-indicator {
          position: absolute;
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--color-accent-primary);
          border-radius: 3px 0 0 3px;
        }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--color-border-secondary);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .sidebar-user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-username {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-email {
          font-size: 0.65rem;
          color: var(--color-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-version {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-align: center;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 64px;
            overflow: hidden;
          }
          .sidebar-brand {
            padding: 16px 12px;
          }
          .logo-text,
          .sidebar-tagline,
          .sidebar-link-label,
          .sidebar-version,
          .sidebar-user-info {
            display: none;
          }
          .sidebar-link {
            justify-content: center;
            padding: 12px;
          }
          .sidebar-link-icon {
            font-size: 1.3rem;
          }
          .sidebar-active-indicator {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
