import React, { useState } from 'react';
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
  Edit
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
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Simplified FileItem component
const FileItem = ({ file, level }: { file: FileType; level: number }) => {
  const { activeFile, setActiveFile, deleteFile, renameFile, createFile, createFolder } = useEditor();
  const [expanded, setExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const { toast } = useToast();
  
  const isActive = activeFile?.id === file.id;
  
  // Handle file/folder click
  const handleFileClick = () => {
    if (file.isDirectory) {
      setExpanded(!expanded);
    } else {
      setActiveFile(file);
    }
  };

  // Handle delete action
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFile(file.id);
    toast({
      title: `${file.isDirectory ? 'Folder' : 'File'} deleted`,
      description: `${file.name} has been removed`
    });
  };

  // Handle rename action
  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewName(file.name);
  };

  // Handle rename form submission
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
  
  // Handle creating a new file in a folder
  const handleNewFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (file.isDirectory) {
      const fileName = `newfile.js`;
      try {
        createFile(fileName, file.id);
        toast({
          title: "File created",
          description: `${fileName} has been created`
        });
      } catch (error) {
        toast({
          title: "Error creating file",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle creating a new folder in a folder
  const handleNewFolder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (file.isDirectory) {
      const folderName = 'New Folder';
      try {
        createFolder(folderName, file.id);
        toast({
          title: "Folder created",
          description: `${folderName} has been created`
        });
      } catch (error) {
        toast({
          title: "Error creating folder",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive"
        });
      }
    }
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
          
          {file.isDirectory && expanded && file.children && file.children.length > 0 && (
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
            <ContextMenuItem onClick={handleNewFile}>
              <FilePlus size={14} className="mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={handleNewFolder}>
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
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  // Handle creating a new item (file or folder)
  const handleCreateItem = async () => {
    if (newItemName.trim() === '' || isCreating) return;
    
    setIsCreating(true);
    try {
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
    } catch (error) {
      toast({
        title: "Error creating item",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Open create file dialog
  const openCreateFileDialog = () => {
    setDialogMode('file');
    setNewItemName('newfile.js');
    setIsDialogOpen(true);
  };
  
  // Open create folder dialog
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
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isCreating}>
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
            <DialogDescription>
              Enter a name for your new {dialogMode}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={dialogMode === 'file' ? 'filename.js' : 'Folder Name'}
              className="w-full"
              autoFocus
              disabled={isCreating}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateItem} disabled={isCreating}>
              {isCreating ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <span className="animate-spin">⚬</span>
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
