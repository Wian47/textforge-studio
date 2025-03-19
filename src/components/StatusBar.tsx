
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';

export default function StatusBar() {
  const { activeFile } = useEditor();
  
  return (
    <div className={cn(
      "h-6 bg-statusbar-background text-statusbar-foreground text-xs flex items-center justify-between px-4",
      "border-t border-border",
    )}>
      <div className="flex items-center space-x-4">
        <span>
          {activeFile ? activeFile.language.toUpperCase() : 'No file open'}
        </span>
        <span>UTF-8</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
      </div>
    </div>
  );
}
