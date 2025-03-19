import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { usePluginManager } from '@/plugins/PluginManager';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import CodeOutput from './CodeOutput';

export default function MonacoEditor() {
  const { activeFile, saveFile, theme, editorSettings, setCursorPosition, setExecutionResult, executionResult } = useEditor();
  const { pluginAPI } = usePluginManager();
  const { toast } = useToast();
  const editorRef = useRef<any>(null);
  const [showOutput, setShowOutput] = useState(false);
  
  // Track current file ID
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  
  // Update model value when activeFile changes
  useEffect(() => {
    if (editorRef.current && activeFile && activeFile.id !== currentFileId) {
      // Set the file ID we're now editing
      setCurrentFileId(activeFile.id);
      
      // Force the editor to update with the correct content
      editorRef.current.setValue(activeFile.content);
    }
  }, [activeFile, currentFileId]);
  
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    
    // Set current file ID when editor mounts
    if (activeFile) {
      setCurrentFileId(activeFile.id);
    }
    
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
  };
  
  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center max-w-md p-6">
          <h3 className="text-lg font-medium mb-2">Welcome to TextForge Studio</h3>
          <p className="mb-4">No file is currently open</p>
          <p className="text-sm">Create a new file from the sidebar to get started coding</p>
          <div className="mt-6 bg-muted/30 p-4 rounded-md text-left text-sm">
            <p className="font-medium mb-2">Quick Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Right-click in the sidebar to create files and folders</li>
              <li>Use the + button in the sidebar to create new items</li>
              <li>Right-click on files to rename or delete them</li>
              <li>Press Ctrl+O to search for files</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className={cn("flex-1 h-0 min-h-0", showOutput && executionResult ? "flex-grow-2" : "")}>
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
          theme={theme === 'dark' ? 'vscode-dark' : 'vscode-light'}
          onMount={handleEditorDidMount}
          key={activeFile.id} // Add key to force recreation when file changes
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
