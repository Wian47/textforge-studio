
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CodeOutputProps {
  output: string;
  isError?: boolean;
}

export default function CodeOutput({ output, isError = false }: CodeOutputProps) {
  return (
    <div className="border-t border-border">
      <div className="p-2 bg-muted text-xs flex items-center justify-between">
        <span className="font-medium">Console Output</span>
        {isError && <span className="text-destructive">Error</span>}
      </div>
      <ScrollArea className="h-[200px] bg-background">
        <pre 
          className={cn(
            "p-4 text-xs font-mono whitespace-pre-wrap",
            isError ? "text-destructive" : "text-foreground"
          )}
        >
          {output || 'No output'}
        </pre>
      </ScrollArea>
    </div>
  );
}
