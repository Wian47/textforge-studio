import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CodeRunner } from '@/services/CodeRunner';
import { useToast } from '@/hooks/use-toast';

export default function RunButton() {
  const { activeFile, saveFile, setExecutionResult } = useEditor();
  const { toast } = useToast();

  const canRunActiveFile = activeFile && ['javascript', 'typescript', 'jsx', 'tsx', 'html'].includes(activeFile.language);

  const runCode = async () => {
    if (!activeFile) return;
    
    try {
      // Handle HTML files differently
      if (activeFile.language === 'html') {
        // Create a blob from the HTML content
        const blob = new Blob([activeFile.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open in a new window
        window.open(url, '_blank');
        
        // Clean up the URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        toast({
          title: "HTML file opened",
          description: "The HTML file has been opened in a new window",
        });
        return;
      }

      // Only run JavaScript/TypeScript files
      if (!['javascript', 'typescript', 'jsx', 'tsx'].includes(activeFile.language)) {
        toast({
          title: "Can't run this file type",
          description: "Only JavaScript, TypeScript, and HTML files can be executed",
          variant: "destructive"
        });
        return;
      }
      
      // Execute the code
      const result = await CodeRunner.executeCode(activeFile.content);
      setExecutionResult(result);
      
      // Show toast notification
      if (result.success) {
        toast({
          title: "Code executed successfully",
          description: "Check the output in the status bar",
        });
      } else {
        toast({
          title: "Error running code",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to run code",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  // Add keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (canRunActiveFile) {
          runCode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canRunActiveFile]);

  const getButtonTitle = () => {
    if (!activeFile) return "No file selected";
    if (activeFile.language === 'html') return "Open HTML in browser (Ctrl+Enter)";
    if (canRunActiveFile) return "Run code (Ctrl+Enter)";
    return "Can only run JavaScript, TypeScript, or HTML files";
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={runCode}
      disabled={!canRunActiveFile}
      className={cn(
        "text-muted-foreground hover:text-foreground",
        canRunActiveFile && "text-green-500 hover:text-green-600"
      )}
      title={getButtonTitle()}
    >
      <Play size={16} />
    </Button>
  );
} 