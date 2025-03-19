import React, { createContext, useState, useContext, useEffect } from 'react';
import { ExecutionResult } from '@/services/CodeRunner';
import { generateId } from '@/lib/utils';

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
  executionResult: ExecutionResult | null;
  setActiveFile: (file: FileType) => void;
  toggleTheme: (newTheme: 'light' | 'dark' | 'system') => void;
  saveFile: (id: string, content: string) => void;
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  setCursorPosition: (position: CursorPosition) => void;
  closeFile: (id: string) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;
  createFile: (name: string, parentId?: string) => string;
  createFolder: (name: string, parentId?: string) => string;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
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

// Start with empty files array
const initialFiles: FileType[] = [];

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileType | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(initialEditorSettings);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>({ lineNumber: 1, column: 1 });
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark' | 'system' | null;
    
    if (savedTheme) {
      // Use saved preference
      setTheme(savedTheme);
      
      if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Use system preference as default if no saved preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        setTheme('system');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage for persistence
    localStorage.setItem('theme-preference', newTheme);
  };

  const updateEditorSettings = (newSettings: Partial<EditorSettings>) => {
    setEditorSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setActiveFileHandler = (file: FileType) => {
    if (file.isDirectory) return;
    
    // Find the file in our files array to get the most up-to-date content
    const findFile = (files: FileType[]): FileType | null => {
      for (const f of files) {
        if (f.id === file.id) return { ...f };  // Return a copy of the file
        if (f.children) {
          const found = findFile(f.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const currentFile = findFile(files);
    if (!currentFile) return;
    
    // Update files array to mark the file as open
    setFiles(prev => {
      const updateFileInArray = (files: FileType[]): FileType[] => {
        return files.map(f => {
          if (f.id === file.id) {
            return { ...f, isOpen: true };
          }
          if (f.children) {
            return { ...f, children: updateFileInArray(f.children) };
          }
          return f;
        });
      };
      return updateFileInArray(prev);
    });
    
    setActiveFile(currentFile);
  };
  
  // Function to determine language from file extension
  const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'py': return 'python';
      default: return 'plaintext';
    }
  };
  
  // Function to create a new file - returns the ID of the new file
  const createFile = (name: string, parentId?: string): string => {
    const newId = generateId();
    const language = getLanguageFromExtension(name);
    
    const newFile: FileType = {
      id: newId,
      name,
      path: parentId ? `/${name}` : `/${name}`,
      content: '',
      language,
      isDirectory: false,
      isOpen: false,
    };
    
    setFiles(prev => {
      if (!parentId) {
        return [...prev, newFile];
      }
      
      // Non-recursive approach using a single pass
      const newFiles = [...prev];
      const findAndAddToParent = (files: FileType[]) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i].id === parentId) {
            files[i].children = [...(files[i].children || []), newFile];
            return true;
          }
          if (files[i].children?.length) {
            if (findAndAddToParent(files[i].children)) {
              return true;
            }
          }
        }
        return false;
      };
      
      findAndAddToParent(newFiles);
      return newFiles;
    });
    
    return newId;
  };
  
  // Function to create a new folder - returns the ID of the new folder
  const createFolder = (name: string, parentId?: string): string => {
    const newId = generateId();
    
    const newFolder: FileType = {
      id: newId,
      name,
      path: parentId ? `/${name}` : `/${name}`,
      content: '',
      language: '',
      isDirectory: true,
      children: []
    };
    
    setFiles(prev => {
      if (!parentId) {
        return [...prev, newFolder];
      }
      
      // Non-recursive approach using a single pass
      const newFiles = [...prev];
      const findAndAddToParent = (files: FileType[]) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i].id === parentId) {
            files[i].children = [...(files[i].children || []), newFolder];
            return true;
          }
          if (files[i].children?.length) {
            if (findAndAddToParent(files[i].children)) {
              return true;
            }
          }
        }
        return false;
      };
      
      findAndAddToParent(newFiles);
      return newFiles;
    });
    
    return newId;
  };
  
  // Function to delete a file or folder recursively
  const deleteFile = (id: string) => {
    // Close the file if it's active
    if (activeFile && activeFile.id === id) {
      setActiveFile(null);
    }
    
    // Remove the file from the files array
    setFiles(prev => prev.filter(file => {
      if (file.id === id) {
        return false;
      }
      
      if (file.children) {
        file.children = file.children.filter(child => child.id !== id);
      }
      
      return true;
    }));
  };
  
  // Function to rename a file or folder
  const renameFile = (id: string, newName: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.map(file => {
        if (file.id === id) {
          const updatedFile = { ...file, name: newName };
          
          // Update language if file extension changed
          if (!file.isDirectory) {
            updatedFile.language = getLanguageFromExtension(newName);
          }
          
          return updatedFile;
        }
        
        if (file.children) {
          return {
            ...file,
            children: file.children.map(child => {
              if (child.id === id) {
                const updatedChild = { ...child, name: newName };
                
                // Update language if file extension changed
                if (!child.isDirectory) {
                  updatedChild.language = getLanguageFromExtension(newName);
                }
                
                // Update active file if it's being renamed
                if (activeFile && activeFile.id === id) {
                  setActiveFile(updatedChild);
                }
                
                return updatedChild;
              }
              
              return child;
            })
          };
        }
        
        return file;
      });
      
      return updatedFiles;
    });
  };
  
  const closeFile = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.map(file => {
        if (file.id === id) {
          return { ...file, isOpen: false };
        }
        
        if (file.children) {
          return {
            ...file,
            children: file.children.map(child => {
              if (child.id === id) {
                return { ...child, isOpen: false };
              }
              return child;
            })
          };
        }
        
        return file;
      });
      
      return updatedFiles;
    });
    
    if (activeFile && activeFile.id === id) {
      // Find another open file to activate
      const openFiles = files.filter(file => file.isOpen && file.id !== id);
      if (openFiles.length > 0) {
        setActiveFile(openFiles[0]);
      } else {
        setActiveFile(null);
      }
    }
  };

  const saveFile = (id: string, content: string) => {
    // Update files array with new content
    setFiles(prev => {
      const updateFileContent = (files: FileType[]): FileType[] => {
        return files.map(f => {
          if (f.id === id) {
            return { ...f, content };
          }
          if (f.children) {
            return { ...f, children: updateFileContent(f.children) };
          }
          return f;
        });
      };
      return updateFileContent(prev);
    });
    
    // Update active file if it's the one being saved
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
        executionResult,
        setActiveFile: setActiveFileHandler, 
        toggleTheme,
        saveFile,
        updateEditorSettings,
        setCursorPosition,
        closeFile,
        setExecutionResult,
        createFile,
        createFolder,
        deleteFile,
        renameFile
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
