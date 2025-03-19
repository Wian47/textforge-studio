
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useEditor();
  
  const handleToggleTheme = () => {
    // Toggle between light and dark, skipping system theme for simplicity
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
  };
  
  return (
    <button
      onClick={handleToggleTheme}
      className={cn(
        "p-2 rounded-md transition-all duration-200",
        "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30",
        "text-muted-foreground hover:text-foreground"
      )}
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? (
        <Moon size={18} className="transition-transform duration-200 ease-in-out" />
      ) : (
        <Sun size={18} className="transition-transform duration-200 ease-in-out" />
      )}
    </button>
  );
}
