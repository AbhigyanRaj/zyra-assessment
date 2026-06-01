import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  // Apply the class to <html> on every change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5',
        'text-xs font-medium text-muted-foreground',
        'bg-card hover:bg-secondary transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50'
      )}
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-3.5 w-3.5" />
          Dark
        </>
      ) : (
        <>
          <Sun className="h-3.5 w-3.5" />
          Light
        </>
      )}
    </button>
  );
}
