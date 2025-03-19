
import React, { createContext, useState, useContext, useEffect } from 'react';

export type CursorPosition = {
  lineNumber: number;
  column: number;
};

export type FileType = {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirectory: boolean;
  isOpen?: boolean;
  children?: FileType[];
};

export type EditorSettings = {
  fontSize: number;
  fontFamily: string;
  minimap: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
  tabSize: number;
  autoClosingBrackets: boolean;
  formatOnSave: boolean;
  autoIndent: boolean;
};

type EditorContextType = {
  files: FileType[];
  activeFile: FileType | null;
  theme: 'light' | 'dark' | 'system';
  editorSettings: EditorSettings;
  cursorPosition: CursorPosition | null;
  setActiveFile: (file: FileType) => void;
  toggleTheme: (newTheme: 'light' | 'dark' | 'system') => void;
  saveFile: (id: string, content: string) => void;
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  setCursorPosition: (position: CursorPosition) => void;
  closeFile: (id: string) => void;
};

const initialEditorSettings: EditorSettings = {
  fontSize: 14,
  fontFamily: 'SF Mono, Menlo, Monaco, Consolas, monospace',
  minimap: false,
  lineNumbers: true,
  wordWrap: false,
  tabSize: 2,
  autoClosingBrackets: true,
  formatOnSave: true,
  autoIndent: true
};

const initialFiles: FileType[] = [
  {
    id: '1',
    name: 'main.js',
    path: '/main.js',
    content: '// Welcome to TextForge Studio\n\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n\n// Start coding here',
    language: 'javascript',
    isDirectory: false,
    isOpen: true,
  },
  {
    id: '2',
    name: 'styles.css',
    path: '/styles.css',
    content: '/* Main Styles */\n\nbody {\n  font-family: system-ui, -apple-system, sans-serif;\n  line-height: 1.5;\n  padding: 2rem;\n}\n\nh1 {\n  color: #3b82f6;\n}',
    language: 'css',
    isDirectory: false,
    isOpen: false,
  },
  {
    id: '3',
    name: 'index.html',
    path: '/index.html',
    content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="main.js"></script>\n</body>\n</html>',
    language: 'html',
    isDirectory: false,
    isOpen: false,
  },
  {
    id: '4',
    name: 'projects',
    path: '/projects',
    content: '',
    language: '',
    isDirectory: true,
    children: [
      {
        id: '5',
        name: 'README.md',
        path: '/projects/README.md',
        content: '# Project Overview\n\nThis is a sample project to demonstrate the TextForge Studio editor capabilities.\n\n## Features\n\n- Syntax highlighting\n- File explorer\n- Theme switching\n',
        language: 'markdown',
        isDirectory: false,
        isOpen: false,
      }
    ]
  }
];

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileType | null>(initialFiles[0]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(initialEditorSettings);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>({ lineNumber: 1, column: 1 });

  // Check for user's preferred color scheme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updateEditorSettings = (newSettings: Partial<EditorSettings>) => {
    setEditorSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setActiveFileHandler = (file: FileType) => {
    // Skip if trying to open a directory
    if (file.isDirectory) return;
    
    // Mark the file as open
    setFiles(prevFiles => {
      const markFileOpen = (files: FileType[]): FileType[] => {
        return files.map(f => {
          if (f.id === file.id) {
            return { ...f, isOpen: true };
          }
          if (f.children) {
            return {
              ...f,
              children: markFileOpen(f.children)
            };
          }
          return f;
        });
      };
      
      return markFileOpen(prevFiles);
    });
    
    setActiveFile(file);
  };
  
  const closeFile = (id: string) => {
    setFiles(prevFiles => {
      const updateFiles = (files: FileType[]): FileType[] => {
        return files.map(file => {
          if (file.id === id) {
            return { ...file, isOpen: false };
          }
          if (file.children) {
            return {
              ...file,
              children: updateFiles(file.children)
            };
          }
          return file;
        });
      };
      
      return updateFiles(prevFiles);
    });
    
    // If we're closing the active file, find a new active file
    if (activeFile && activeFile.id === id) {
      // Find an open file to switch to
      const flattenFiles = (fileTree: FileType[]): FileType[] => {
        return fileTree.reduce((acc, file) => {
          if (file.isDirectory && file.children) {
            return [...acc, ...flattenFiles(file.children)];
          }
          return [...acc, file];
        }, [] as FileType[]);
      };
      
      const openFiles = flattenFiles(files).filter(file => file.isOpen && file.id !== id);
      if (openFiles.length > 0) {
        setActiveFile(openFiles[0]);
      } else {
        setActiveFile(null);
      }
    }
  };

  const saveFile = (id: string, content: string) => {
    setFiles(prevFiles => {
      const updateFileContent = (files: FileType[]): FileType[] => {
        return files.map(file => {
          if (file.id === id) {
            return { ...file, content };
          }
          if (file.children) {
            return {
              ...file,
              children: updateFileContent(file.children)
            };
          }
          return file;
        });
      };
      
      return updateFileContent(prevFiles);
    });
    
    if (activeFile && activeFile.id === id) {
      setActiveFile(prev => prev ? { ...prev, content } : null);
    }
  };

  return (
    <EditorContext.Provider 
      value={{ 
        files, 
        activeFile, 
        theme,
        editorSettings,
        cursorPosition,
        setActiveFile: setActiveFileHandler, 
        toggleTheme,
        saveFile,
        updateEditorSettings,
        setCursorPosition,
        closeFile
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
