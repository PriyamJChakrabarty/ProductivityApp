'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="landing">
      <div className={`landing-content ${visible ? 'visible' : ''}`}>
        <div className="landing-icon">⚡</div>
        <h1 className="landing-title">Questify</h1>
        <p className="landing-subtitle">Your life is the game. Level up.</p>

        {isLoaded && !isSignedIn && (
          <div className="landing-actions">
            <a href="/sign-in" className="btn-primary landing-btn">
              🗡️ Sign In
            </a>
            <a href="/sign-up" className="btn-secondary landing-btn">
              ⚔️ Create Account
            </a>
          </div>
        )}

        {isLoaded && isSignedIn && (
          <div className="landing-loader">
            <div className="loader-bar">
              <div className="loader-fill" />
            </div>
            <span className="loader-text">Loading your adventure...</span>
          </div>
        )}

        {!isLoaded && (
          <div className="landing-loader">
            <div className="loader-bar">
              <div className="loader-fill-slow" />
            </div>
            <span className="loader-text">Initializing...</span>
          </div>
        )}
      </div>

      <div className="landing-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .landing {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(
            ellipse at center,
            rgba(139, 92, 246, 0.1) 0%,
            var(--color-bg-primary) 70%
          );
        }

        .landing-content {
          text-align: center;
          z-index: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .landing-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .landing-icon {
          font-size: 4rem;
          margin-bottom: 12px;
          animation: float 3s ease-in-out infinite;
        }

        .landing-title {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(
            135deg,
            #8b5cf6,
            #6366f1,
            #38bdf8,
            #22d3ee
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .landing-subtitle {
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          margin-bottom: 40px;
          font-weight: 500;
        }

        .landing-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .landing-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .landing-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
        }

        .landing-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .loader-bar {
          width: 200px;
          height: 4px;
          background: var(--color-bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
        }

        .loader-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #6366f1, #38bdf8);
          border-radius: 999px;
          animation: loading 1.6s ease-in-out forwards;
        }

        .loader-fill-slow {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #6366f1, #38bdf8);
          border-radius: 999px;
          width: 30%;
          animation: pulse-width 1.5s ease-in-out infinite;
        }

        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes pulse-width {
          0%,
          100% {
            width: 30%;
          }
          50% {
            width: 60%;
          }
        }

        .loader-text {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
        }

        .landing-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          bottom: -10px;
          width: 4px;
          height: 4px;
          background: var(--color-accent-primary);
          border-radius: 50%;
          opacity: 0.4;
          animation: particle-float linear infinite;
        }

        .particle:nth-child(even) {
          background: var(--color-accent-gold);
          width: 3px;
          height: 3px;
        }

        .particle:nth-child(3n) {
          background: var(--color-accent-sky);
          width: 5px;
          height: 5px;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
