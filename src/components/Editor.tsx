
import React, { useRef, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { usePluginManager } from '@/plugins/PluginManager';
import Editor, { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';

export default function MonacoEditor() {
  const { activeFile, saveFile, theme, editorSettings } = useEditor();
  const { pluginAPI } = usePluginManager();
  const editorRef = useRef<any>(null);
  
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
    
    // Add keyboard shortcuts for modal editing
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      // Command palette functionality
      console.log('Command palette triggered');
    });
  };
  
  // Update editor settings when they change
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.updateOptions({
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        minimap: { enabled: editorSettings.minimap },
        lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
        wordWrap: editorSettings.wordWrap ? 'on' : 'off',
        tabSize: editorSettings.tabSize,
        autoClosingBrackets: editorSettings.autoClosingBrackets ? 'always' : 'never',
        autoClosingQuotes: editorSettings.autoClosingBrackets ? 'always' : 'never',
        autoIndent: editorSettings.autoIndent ? 'advanced' : 'none'
      });
    }
  }, [editorSettings]);
  
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
          fontSize: editorSettings.fontSize,
          fontFamily: editorSettings.fontFamily,
          minimap: { enabled: editorSettings.minimap },
          scrollBeyondLastLine: false,
          lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
          glyphMargin: false,
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
          autoIndent: editorSettings.autoIndent ? 'advanced' : 'none'
        }}
        className={cn(
          "bg-editor-background text-editor-foreground rounded-md transition-colors duration-300",
          "outline-none"
        )}
      />
    </div>
  );
}
