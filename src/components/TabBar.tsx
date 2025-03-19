
import React from 'react';
import { X } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TabBar() {
  const { files, activeFile, setActiveFile, closeFile } = useEditor();
  
  // Only show tabs for open files
  const openFiles = files.filter(file => file.isOpen);
  
  return (
    <div className="bg-card border-b border-border/50 h-9 flex-shrink-0 shadow-sm">
      <ScrollArea className="h-full">
        <div className="flex h-full">
          {openFiles.map(file => (
            <div
              key={file.id}
              className={cn(
                "h-full flex items-center px-3 border-r border-border/30 min-w-[120px] max-w-[200px] group transition-colors",
                activeFile?.id === file.id 
                  ? "bg-background/70 text-foreground border-b-2 border-b-primary" 
                  : "bg-card/80 text-muted-foreground hover:bg-card/90"
              )}
              onClick={() => setActiveFile(file)}
            >
              <div className="flex items-center justify-between w-full overflow-hidden">
                <span className="truncate text-sm">{file.name}</span>
                <button 
                  className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground hover:text-foreground transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.id);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
