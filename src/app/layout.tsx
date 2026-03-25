import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';

export const metadata: Metadata = {
  title: 'Questify — Gamified Productivity',
  description:
    'Turn your life into an evolving game. Tasks become quests, consistency becomes streaks, and progress becomes visible.',
  keywords: ['productivity', 'gamification', 'tasks', 'habits', 'quests', 'RPG'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#8b5cf6',
              colorBackground: '#111827',
              colorInputBackground: '#1a2234',
              colorInputText: '#f1f5f9',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
