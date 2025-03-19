
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { usePluginManager } from '@/plugins/PluginManager';
import { cn } from '@/lib/utils';

export default function StatusBar() {
  const { activeFile } = useEditor();
  const { loadedPlugins, plugins, statusBarItems } = usePluginManager();
  
  // Get status bar items from the plugin manager
  const leftItems = Object.entries(statusBarItems || {})
    .filter(([_, item]) => item.position === 'left')
    .map(([id, item]) => (
      <div key={id} className="mr-4">
        {item.element}
      </div>
    ));
    
  const rightItems = Object.entries(statusBarItems || {})
    .filter(([_, item]) => item.position === 'right')
    .map(([id, item]) => (
      <div key={id} className="ml-4">
        {item.element}
      </div>
    ));
  
  return (
    <div className={cn(
      "h-6 bg-statusbar-background text-statusbar-foreground text-xs flex items-center justify-between px-4",
      "border-t border-border",
    )}>
      <div className="flex items-center">
        {leftItems}
        <span className="ml-2">
          {activeFile ? activeFile.language.toUpperCase() : 'No file open'}
        </span>
        <span className="ml-4">UTF-8</span>
        <span className="ml-4">{loadedPlugins.length} plugins active</span>
      </div>
      <div className="flex items-center">
        {rightItems}
        <span className="ml-4">Ln 1, Col 1</span>
        <span className="ml-4">Spaces: 2</span>
      </div>
    </div>
  );
}
