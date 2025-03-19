
import React, { createContext, useState, useContext, useEffect } from 'react';

export type FileType = {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirectory: boolean;
  children?: FileType[];
};

type EditorContextType = {
  files: FileType[];
  activeFile: FileType | null;
  theme: 'light' | 'dark';
  setActiveFile: (file: FileType) => void;
  toggleTheme: () => void;
  saveFile: (id: string, content: string) => void;
};

const initialFiles: FileType[] = [
  {
    id: '1',
    name: 'main.js',
    path: '/main.js',
    content: '// Welcome to TextForge Studio\n\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n\n// Start coding here',
    language: 'javascript',
    isDirectory: false,
  },
  {
    id: '2',
    name: 'styles.css',
    path: '/styles.css',
    content: '/* Main Styles */\n\nbody {\n  font-family: system-ui, -apple-system, sans-serif;\n  line-height: 1.5;\n  padding: 2rem;\n}\n\nh1 {\n  color: #3b82f6;\n}',
    language: 'css',
    isDirectory: false,
  },
  {
    id: '3',
    name: 'index.html',
    path: '/index.html',
    content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="main.js"></script>\n</body>\n</html>',
    language: 'html',
    isDirectory: false,
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
      }
    ]
  }
];

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileType | null>(initialFiles[0]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Check for user's preferred color scheme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
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
        setActiveFile, 
        toggleTheme,
        saveFile
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
