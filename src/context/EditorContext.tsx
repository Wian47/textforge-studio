
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
  createFile: (name: string, parentId?: string) => void;
  createFolder: (name: string, parentId?: string) => void;
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
    if (file.isDirectory) return;
    
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
  
  // Function to create a new file
  const createFile = (name: string, parentId?: string) => {
    const newId = generateId();
    const extension = name.split('.').pop()?.toLowerCase() || '';
    let language = 'plaintext';
    
    // Determine language from file extension
    if (extension === 'js') language = 'javascript';
    else if (extension === 'ts') language = 'typescript';
    else if (extension === 'jsx') language = 'javascript';
    else if (extension === 'tsx') language = 'typescript';
    else if (extension === 'css') language = 'css';
    else if (extension === 'html') language = 'html';
    else if (extension === 'json') language = 'json';
    else if (extension === 'md') language = 'markdown';
    else if (extension === 'py') language = 'python';
    
    const newFile: FileType = {
      id: newId,
      name,
      path: parentId ? `/${name}` : `/${name}`,
      content: '',
      language,
      isDirectory: false,
      isOpen: true,
    };
    
    // Create a new copy of the files state to ensure immutability
    if (!parentId) {
      // Add to root
      setFiles(prev => [...prev, newFile]);
    } else {
      // Add to specific folder
      setFiles(prev => {
        const addFileToFolder = (files: FileType[]): FileType[] => {
          return files.map(file => {
            if (file.id === parentId) {
              return {
                ...file,
                children: [...(file.children || []), newFile]
              };
            }
            if (file.children) {
              return {
                ...file,
                children: addFileToFolder(file.children)
              };
            }
            return file;
          });
        };
        
        return addFileToFolder([...prev]);
      });
    }
    
    // Set as active file after state update
    setTimeout(() => {
      setActiveFile(newFile);
    }, 0);
  };
  
  // Function to create a new folder
  const createFolder = (name: string, parentId?: string) => {
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
    
    // Create a new copy of the files state to ensure immutability
    if (!parentId) {
      // Add to root
      setFiles(prev => [...prev, newFolder]);
    } else {
      // Add to specific folder
      setFiles(prev => {
        const addFolderToFolder = (files: FileType[]): FileType[] => {
          return files.map(file => {
            if (file.id === parentId) {
              return {
                ...file,
                children: [...(file.children || []), newFolder]
              };
            }
            if (file.children) {
              return {
                ...file,
                children: addFolderToFolder(file.children)
              };
            }
            return file;
          });
        };
        
        return addFolderToFolder([...prev]);
      });
    }
  };
  
  // Function to delete a file or folder
  const deleteFile = (id: string) => {
    // Close file if it's active
    if (activeFile && activeFile.id === id) {
      setActiveFile(null);
    }
    
    setFiles(prev => {
      const deleteFileById = (files: FileType[]): FileType[] => {
        return files.filter(file => {
          if (file.id === id) {
            return false; // Remove this file
          }
          if (file.children) {
            file.children = deleteFileById(file.children);
          }
          return true;
        });
      };
      
      return deleteFileById([...prev]);
    });
  };
  
  // Function to rename a file or folder
  const renameFile = (id: string, newName: string) => {
    setFiles(prev => {
      const renameFileById = (files: FileType[]): FileType[] => {
        return files.map(file => {
          if (file.id === id) {
            // Update active file if it's the one being renamed
            if (activeFile && activeFile.id === id) {
              const updatedFile = {
                ...file,
                name: newName
              };
              
              // Update language if file extension changed
              if (!file.isDirectory) {
                const extension = newName.split('.').pop()?.toLowerCase() || '';
                if (extension === 'js') updatedFile.language = 'javascript';
                else if (extension === 'ts') updatedFile.language = 'typescript';
                else if (extension === 'jsx') updatedFile.language = 'javascript';
                else if (extension === 'tsx') updatedFile.language = 'typescript';
                else if (extension === 'css') updatedFile.language = 'css';
                else if (extension === 'html') updatedFile.language = 'html';
                else if (extension === 'json') updatedFile.language = 'json';
                else if (extension === 'md') updatedFile.language = 'markdown';
                else if (extension === 'py') updatedFile.language = 'python';
              }
              
              setTimeout(() => {
                setActiveFile(updatedFile);
              }, 0);
              
              return updatedFile;
            }
            
            // Determine language if file extension changed
            let language = file.language;
            if (!file.isDirectory) {
              const extension = newName.split('.').pop()?.toLowerCase() || '';
              if (extension === 'js') language = 'javascript';
              else if (extension === 'ts') language = 'typescript';
              else if (extension === 'jsx') language = 'javascript';
              else if (extension === 'tsx') language = 'typescript';
              else if (extension === 'css') language = 'css';
              else if (extension === 'html') language = 'html';
              else if (extension === 'json') language = 'json';
              else if (extension === 'md') language = 'markdown';
              else if (extension === 'py') language = 'python';
            }
            
            return {
              ...file,
              name: newName,
              language
            };
          }
          if (file.children) {
            return {
              ...file,
              children: renameFileById(file.children)
            };
          }
          return file;
        });
      };
      
      return renameFileById([...prev]);
    });
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
      
      return updateFiles([...prevFiles]);
    });
    
    if (activeFile && activeFile.id === id) {
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
      
      return updateFileContent([...prevFiles]);
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
