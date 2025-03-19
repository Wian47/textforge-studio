
import React from 'react';
import { Code } from 'lucide-react';
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
      </div>
    </header>
  );
}
