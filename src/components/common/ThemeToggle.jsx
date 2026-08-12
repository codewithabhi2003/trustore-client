import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="relative w-14 h-8 rounded-full bg-input border border-border hover:border-accent/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
    >
      <span
        className={`absolute left-1 top-1/2 w-6 h-6 rounded-full bg-accent shadow-sm flex items-center justify-center -translate-y-1/2 transition-transform duration-300 ease-out ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon
            className="w-3.5 h-3.5 text-white"
            strokeWidth={2.2}
          />
        ) : (
          <Sun
            className="w-3.5 h-3.5 text-white"
            strokeWidth={2.2}
          />
        )}
      </span>

      <span
        className={`absolute inset-0 flex items-center pointer-events-none ${
          isDark ? 'justify-start pl-2' : 'justify-end pr-2'
        }`}
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-text-muted" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-text-muted" />
        )}
      </span>
    </button>
  );
}