import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useEditor();
  
  const handleToggleTheme = () => {
    // Cycle between light, dark, and system themes
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    toggleTheme(themes[nextIndex]);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleToggleTheme}
            className={cn(
              "p-2 rounded-md transition-all duration-300",
              "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun size={18} className="transition-transform duration-300 ease-in-out hover:rotate-12" />
            ) : theme === 'dark' ? (
              <Moon size={18} className="transition-transform duration-300 ease-in-out hover:rotate-12" />
            ) : (
              <Monitor size={18} className="transition-transform duration-300 ease-in-out hover:rotate-12" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Current theme: {theme}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
