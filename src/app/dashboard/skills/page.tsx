'use client';

export default function SkillsPage() {
  const skills = [
    { name: 'Focus', icon: '🎯', description: 'Boost XP from completed tasks', level: 0, maxLevel: 5, cost: 50 },
    { name: 'Discipline', icon: '🛡️', description: 'Protect your streaks', level: 0, maxLevel: 5, cost: 75 },
    { name: 'Consistency', icon: '🔥', description: 'Earn bonus streak rewards', level: 0, maxLevel: 5, cost: 60 },
    { name: 'Endurance', icon: '⚡', description: 'Increase max energy', level: 0, maxLevel: 5, cost: 80 },
    { name: 'Vitality', icon: '❤️', description: 'Increase max health', level: 0, maxLevel: 5, cost: 70 },
    { name: 'Fortune', icon: '🍀', description: 'Better loot drop rates', level: 0, maxLevel: 5, cost: 100 },
  ];

  return (
    <div className="skills-page">
      <h1 className="page-title animate-fade-in">🌟 Skill Tree</h1>
      <p className="page-subtitle animate-fade-in">
        Spend gold to unlock powerful abilities. Coming in Phase 6!
      </p>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            className="skill-card animate-slide-in-up"
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="skill-icon-wrap">
              <span className="skill-icon">{skill.icon}</span>
            </div>
            <div className="skill-info">
              <h3 className="skill-name">{skill.name}</h3>
              <p className="skill-desc">{skill.description}</p>
              <div className="skill-level">
                {Array.from({ length: skill.maxLevel }).map((_, i) => (
                  <div
                    key={i}
                    className={`level-dot ${i < skill.level ? 'level-filled' : ''}`}
                  />
                ))}
              </div>
              <span className="skill-cost">🪙 {skill.cost} to unlock</span>
            </div>
            <button className="btn-secondary skill-btn" disabled>
              🔒 Locked
            </button>
          </div>
        ))}
      </div>

      <div className="coming-soon-banner animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <span className="banner-icon">🚧</span>
        <div>
          <h3 className="banner-title">Under Construction</h3>
          <p className="banner-text">
            The Skill Tree system will be available in Phase 6. Keep completing quests to earn gold!
          </p>
        </div>
      </div>

      <style jsx>{`
        .skills-page {
          max-width: 800px;
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

        .skills-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }

        .skill-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-secondary);
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .skill-card:hover {
          opacity: 0.8;
          border-color: var(--color-border-primary);
        }

        .skill-icon-wrap {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .skill-icon {
          font-size: 1.5rem;
        }

        .skill-info {
          flex: 1;
          min-width: 0;
        }

        .skill-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 2px;
        }

        .skill-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }

        .skill-level {
          display: flex;
          gap: 4px;
          margin-bottom: 4px;
        }

        .level-dot {
          width: 16px;
          height: 4px;
          background: var(--color-bg-tertiary);
          border-radius: 2px;
        }

        .level-filled {
          background: var(--color-accent-primary);
        }

        .skill-cost {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        .skill-btn {
          flex-shrink: 0;
          opacity: 0.5;
          cursor: not-allowed;
        }

        .coming-soon-banner {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--radius-lg);
        }

        .banner-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .banner-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }

        .banner-text {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
