import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <header className="relative z-10 w-full">
      <nav
        className="glass-l1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between"
        style={{ 
          margin: '1rem auto',
          background: isDark ? 'rgba(26, 31, 46, 0.35)' : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: isDark ? '1px solid rgba(45, 55, 72, 0.25)' : '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Left: Logo/Branding */}
        <div className="relative z-10">
          <span className="text-nav tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            BEM RDM FHUB
          </span>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={toggleTheme}
            className="btn btn-secondary !p-2.5 !min-h-0 !w-11 !h-11"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
