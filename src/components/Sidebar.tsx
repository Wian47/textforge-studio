
import React, { useState } from 'react';
import { useEditor, FileType } from '@/context/EditorContext';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileItemProps = {
  file: FileType;
  level: number;
};

const FileItem = ({ file, level }: FileItemProps) => {
  const { activeFile, setActiveFile } = useEditor();
  const [expanded, setExpanded] = useState(true);
  
  const isActive = activeFile?.id === file.id;
  
  const handleFileClick = () => {
    if (file.isDirectory) {
      setExpanded(!expanded);
    } else {
      setActiveFile(file);
    }
  };
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer transition-colors duration-200",
          isActive ? "bg-primary/10 text-primary" : "hover:bg-sidebar-hover text-sidebar-foreground",
        )}
        style={{ paddingLeft: `${(level + 1) * 0.5}rem` }}
        onClick={handleFileClick}
      >
        {file.isDirectory ? (
          <>
            <span className="mr-1">
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
            {expanded ? <FolderOpen size={16} className="mr-2" /> : <Folder size={16} className="mr-2" />}
          </>
        ) : (
          <File size={16} className="mr-2" />
        )}
        <span className="truncate">{file.name}</span>
      </div>
      
      {file.isDirectory && expanded && file.children && (
        <div className="animate-in">
          {file.children.map((child) => (
            <FileItem key={child.id} file={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const { files } = useEditor();
  
  return (
    <div className="w-60 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full">
      <div className="p-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Explorer
      </div>
      <div className="flex-1 overflow-auto p-1">
        {files.map((file) => (
          <FileItem key={file.id} file={file} level={0} />
        ))}
      </div>
    </div>
  );
}
