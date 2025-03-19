import React from 'react';
import { Code, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SettingsMenu from './SettingsMenu';
import RunButton from './RunButton';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className={cn(
      "h-12 bg-header-background border-b border-border/40 flex items-center justify-between px-4",
      "text-header-foreground shadow-sm"
    )}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-primary/10 rounded-md p-1">
          <Zap size={16} className="text-primary mr-1" />
          <Code size={16} className="text-primary" />
        </div>
        <h1 className="text-lg font-medium bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          TextForge Studio
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <RunButton />
        <SettingsMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
