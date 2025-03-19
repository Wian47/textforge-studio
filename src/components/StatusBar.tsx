
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { usePluginManager } from '@/plugins/PluginManager';
import { cn } from '@/lib/utils';
import { FileType } from '@/context/EditorContext';
import { Hash, GitBranch, AlertCircle, Check, Wifi } from 'lucide-react';

export default function StatusBar() {
  const { activeFile, editorSettings, cursorPosition } = useEditor();
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
    
  // Get file extension
  const getFileExtension = (file: FileType | null) => {
    if (!file) return '';
    return file.name.split('.').pop()?.toUpperCase() || '';
  };
  
  return (
    <div className={cn(
      "h-6 bg-statusbar-background text-statusbar-foreground text-xs flex items-center justify-between px-4",
      "border-t border-border",
    )}>
      <div className="flex items-center">
        {leftItems}
        <div className="flex items-center mr-4 text-green-500">
          <Check size={12} className="mr-1" />
          <span>No Problems</span>
        </div>
        <div className="flex items-center mr-4">
          <GitBranch size={12} className="mr-1" />
          <span>main</span>
        </div>
        <div className="flex items-center">
          <Wifi size={12} className="mr-1" />
          <span>Connected</span>
        </div>
      </div>
      <div className="flex items-center">
        {rightItems}
        <span className="ml-4">{getFileExtension(activeFile)}</span>
        <span className="ml-4">UTF-8</span>
        <span className="ml-4">
          Ln {cursorPosition?.lineNumber || 1}, Col {cursorPosition?.column || 1}
        </span>
        <span className="ml-4">Spaces: {editorSettings.tabSize}</span>
      </div>
    </div>
  );
}
