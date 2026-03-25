import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-content">
        <div className="auth-brand">
          <span className="auth-logo">⚡</span>
          <h1 className="auth-title">Questify</h1>
          <p className="auth-subtitle">Sign in to continue your adventure</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: { width: '100%', maxWidth: '440px' },
              card: {
                background: '#151d2e',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              },
            },
          }}
        />
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .auth-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 40%, rgba(139, 92, 246, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
        }

        .auth-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 20px;
        }

        .auth-brand {
          text-align: center;
        }

        .auth-logo {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 8px;
        }

        .auth-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #8b5cf6, #6366f1, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
