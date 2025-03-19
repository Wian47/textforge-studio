
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Terminal, AlertCircle } from 'lucide-react';

interface CodeOutputProps {
  output: string;
  isError?: boolean;
}

export default function CodeOutput({ output, isError = false }: CodeOutputProps) {
  return (
    <div className="border-t border-border/50 rounded-b-md overflow-hidden transition-all">
      <div className="p-2 bg-muted/30 text-xs flex items-center justify-between">
        <span className="font-medium flex items-center gap-1.5">
          {isError ? (
            <AlertCircle size={14} className="text-destructive" />
          ) : (
            <Terminal size={14} className="text-primary/70" />
          )}
          Console Output
        </span>
        {isError && <span className="text-destructive text-xs font-medium">Error</span>}
      </div>
      <ScrollArea className="h-[200px] bg-background/50 backdrop-blur-sm">
        <pre 
          className={cn(
            "p-4 text-xs font-mono whitespace-pre-wrap transition-colors",
            isError ? "text-destructive" : "text-foreground"
          )}
        >
          {output || 'No output'}
        </pre>
      </ScrollArea>
    </div>
  );
}
