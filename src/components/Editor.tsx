
import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { usePluginManager } from '@/plugins/PluginManager';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { CodeRunner } from '@/services/CodeRunner';
import { useToast } from '@/hooks/use-toast';
import CodeOutput from './CodeOutput';

export default function MonacoEditor() {
  const { activeFile, saveFile, theme, editorSettings, setCursorPosition, setExecutionResult, executionResult } = useEditor();
  const { pluginAPI } = usePluginManager();
  const { toast } = useToast();
  const editorRef = useRef<any>(null);
  const [showOutput, setShowOutput] = useState(false);
  
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    
    // Make the editor instance available to plugins
    if (pluginAPI) {
      pluginAPI.editor = editor;
    }
    
    // Add auto-save functionality
    editor.onDidChangeModelContent(() => {
      if (activeFile) {
        const content = editor.getValue();
        saveFile(activeFile.id, content);
      }
    });
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column
      });
    });
    
    // Add keyboard shortcuts for modal editing
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      // Command palette functionality
      console.log('Command palette triggered');
    });
    
    // Configure editor highlighting
    monaco.editor.defineTheme('vscode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2d2e',
        'editorCursor.foreground': '#d4d4d4',
        'editorWhitespace.foreground': '#3b3b3b'
      }
    });
    
    monaco.editor.defineTheme('vscode-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#333333',
        'editor.lineHighlightBackground': '#f3f3f3',
        'editorCursor.foreground': '#333333',
        'editorWhitespace.foreground': '#d4d4d4'
      }
    });
    
    // Apply initial editor settings
    updateEditorOptions(editor);
  };
  
  // Update editor options when settings change
  const updateEditorOptions = (editor: any) => {
    if (!editor) return;
    
    editor.updateOptions({
      fontSize: editorSettings.fontSize,
      fontFamily: editorSettings.fontFamily,
      minimap: { enabled: editorSettings.minimap },
      lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
      wordWrap: editorSettings.wordWrap ? 'on' : 'off',
      tabSize: editorSettings.tabSize,
      autoClosingBrackets: editorSettings.autoClosingBrackets ? 'always' : 'never',
      autoClosingQuotes: editorSettings.autoClosingBrackets ? 'always' : 'never',
      autoIndent: editorSettings.autoIndent ? 'advanced' : 'none',
      renderLineHighlight: 'line',
      cursorBlinking: 'smooth',
      renderWhitespace: 'selection',
      renderIndentGuides: true,
      codeLens: true,
      contextmenu: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true
    });
  };
  
  // Update editor settings when they change
  useEffect(() => {
    if (editorRef.current) {
      updateEditorOptions(editorRef.current);
    }
  }, [editorSettings]);

  // Function to run the active file's code
  const runCode = async () => {
    if (!activeFile) return;
    
    try {
      // Only run JavaScript/TypeScript files
      if (!['javascript', 'typescript', 'jsx', 'tsx'].includes(activeFile.language)) {
        toast({
          title: "Can't run this file type",
          description: "Only JavaScript and TypeScript files can be executed",
          variant: "destructive"
        });
        return;
      }
      
      // Make sure we have the latest content
      const content = editorRef.current?.getValue() || activeFile.content;
      saveFile(activeFile.id, content);
      
      // Execute the code
      const result = await CodeRunner.executeCode(content);
      setExecutionResult(result);
      setShowOutput(true);
      
      // Show toast notification
      if (result.success) {
        toast({
          title: "Code executed successfully",
          description: "Check the console output panel",
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
  
  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="mb-2">No file is currently open</p>
          <p className="text-sm">Select a file from the sidebar to start editing</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-end bg-card px-2 py-1 border-b border-border">
        <button
          onClick={runCode}
          className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          disabled={!['javascript', 'typescript', 'jsx', 'tsx'].includes(activeFile.language)}
          title="Run code (Ctrl+Enter)"
        >
          <Play size={12} className="mr-1" />
          Run
        </button>
      </div>
      <div className={cn("flex-1 h-0 min-h-0", showOutput && executionResult ? "flex-grow-2" : "")}>
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
          theme={theme === 'dark' ? 'vscode-dark' : 'vscode-light'}
          onMount={handleEditorDidMount}
          options={{
            fontSize: editorSettings.fontSize,
            fontFamily: editorSettings.fontFamily,
            minimap: { enabled: editorSettings.minimap },
            scrollBeyondLastLine: false,
            lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            automaticLayout: true,
            tabSize: editorSettings.tabSize,
            wordWrap: editorSettings.wordWrap ? 'on' : 'off',
            padding: { top: 10 },
            scrollbar: {
              useShadows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            autoClosingBrackets: editorSettings.autoClosingBrackets ? 'always' : 'never',
            autoClosingQuotes: editorSettings.autoClosingBrackets ? 'always' : 'never',
            autoIndent: editorSettings.autoIndent ? 'advanced' : 'none',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            guides: { indentation: true },
            codeLens: true,
            contextmenu: true,
            smoothScrolling: true,
            links: true
          }}
          className={cn(
            "bg-editor-background text-editor-foreground rounded-md transition-colors duration-300",
            "outline-none"
          )}
        />
      </div>
      
      {showOutput && executionResult && (
        <CodeOutput 
          output={executionResult.error || executionResult.output} 
          isError={!executionResult.success}
        />
      )}
    </div>
  );
}
