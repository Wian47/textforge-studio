
import React, { useState, useRef } from 'react';
import { useEditor, FileType } from '@/context/EditorContext';
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  FilePlus, 
  FolderPlus,
  Trash,
  Edit,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type FileItemProps = {
  file: FileType;
  level: number;
};

const FileItem = ({ file, level }: FileItemProps) => {
  const { activeFile, setActiveFile, deleteFile, renameFile } = useEditor();
  const [expanded, setExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const { toast } = useToast();
  
  const isActive = activeFile?.id === file.id;
  
  const handleFileClick = () => {
    if (file.isDirectory) {
      setExpanded(!expanded);
    } else {
      setActiveFile(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFile(file.id);
    toast({
      title: `${file.isDirectory ? 'Folder' : 'File'} deleted`,
      description: `${file.name} has been removed`
    });
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewName(file.name);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === '') return;
    
    renameFile(file.id, newName);
    setIsRenaming(false);
    toast({
      title: "Renamed successfully",
      description: `Renamed to ${newName}`
    });
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>
          {isRenaming ? (
            <form onSubmit={handleRenameSubmit} className="pl-2 pr-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-7 text-xs"
                autoFocus
                onBlur={() => setIsRenaming(false)}
                onClick={(e) => e.stopPropagation()}
              />
            </form>
          ) : (
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
          )}
          
          {file.isDirectory && expanded && file.children && (
            <div className="animate-in">
              {file.children.map((child) => (
                <FileItem key={child.id} file={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48">
        {!file.isDirectory && (
          <ContextMenuItem onClick={() => setActiveFile(file)}>
            Open
          </ContextMenuItem>
        )}
        {file.isDirectory && (
          <>
            <ContextMenuItem onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Collapse' : 'Expand'}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={(e) => {
              e.preventDefault();
              const parentId = file.id;
              const fileName = `newfile.js`;
              useEditor().createFile(fileName, parentId);
              toast({
                title: "File created",
                description: `${fileName} has been created`
              });
            }}>
              <FilePlus size={14} className="mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={(e) => {
              e.preventDefault();
              const parentId = file.id;
              const folderName = 'New Folder';
              useEditor().createFolder(folderName, parentId);
              toast({
                title: "Folder created",
                description: `${folderName} has been created`
              });
            }}>
              <FolderPlus size={14} className="mr-2" />
              New Folder
            </ContextMenuItem>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleRenameClick}>
          <Edit size={14} className="mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
          <Trash size={14} className="mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default function Sidebar() {
  const { files, createFile, createFolder } = useEditor();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const { toast } = useToast();
  
  const handleCreateItem = () => {
    if (newItemName.trim() === '') return;
    
    if (dialogMode === 'file') {
      createFile(newItemName);
      toast({
        title: "File created",
        description: `${newItemName} has been created`
      });
    } else {
      createFolder(newItemName);
      toast({
        title: "Folder created",
        description: `${newItemName} has been created`
      });
    }
    
    setIsDialogOpen(false);
    setNewItemName('');
  };
  
  const openCreateFileDialog = () => {
    setDialogMode('file');
    setNewItemName('newfile.js');
    setIsDialogOpen(true);
  };
  
  const openCreateFolderDialog = () => {
    setDialogMode('folder');
    setNewItemName('New Folder');
    setIsDialogOpen(true);
  };
  
  return (
    <div className="w-60 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full">
      <div className="p-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>Explorer</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={openCreateFileDialog}>
              <FilePlus size={14} className="mr-2" />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openCreateFolderDialog}>
              <FolderPlus size={14} className="mr-2" />
              New Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 overflow-auto p-1">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>No files yet</p>
            <p className="text-xs mt-1">Create a new file or folder to get started</p>
          </div>
        ) : (
          files.map((file) => (
            <FileItem key={file.id} file={file} level={0} />
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'file' ? 'Create New File' : 'Create New Folder'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={dialogMode === 'file' ? 'filename.js' : 'Folder Name'}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateItem}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
