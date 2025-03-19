
import React, { useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';

export default function MonacoEditor() {
  const { activeFile, saveFile, theme } = useEditor();
  const editorRef = useRef<any>(null);
  
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    
    // Add auto-save functionality
    editor.onDidChangeModelContent(() => {
      if (activeFile) {
        const content = editor.getValue();
        saveFile(activeFile.id, content);
      }
    });
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
    <div className="flex-1 h-full">
      <Editor
        height="100%"
        language={activeFile.language}
        value={activeFile.content}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: 'SF Mono, Menlo, Monaco, Consolas, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 10 },
          scrollbar: {
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
        className={cn(
          "bg-editor-background text-editor-foreground rounded-md transition-colors duration-300",
          "outline-none"
        )}
      />
    </div>
  );
}
