
import React from 'react';
import { Code, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className={cn(
      "h-12 bg-header-background border-b border-border flex items-center justify-between px-4",
      "text-header-foreground"
    )}>
      <div className="flex items-center space-x-2">
        <Code size={20} className="text-primary" />
        <h1 className="text-lg font-medium">TextForge Studio</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <button
          className={cn(
            "p-2 rounded-md transition-all duration-200",
            "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30",
            "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
