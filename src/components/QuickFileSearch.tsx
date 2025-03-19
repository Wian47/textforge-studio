
import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuickFileSearch() {
  const [open, setOpen] = useState(false);
  const { files, setActiveFile } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten the file tree to search all files
  const flattenFiles = (fileTree: any[]): any[] => {
    return fileTree.reduce((acc, file) => {
      if (file.isDirectory && file.children) {
        return [...acc, file, ...flattenFiles(file.children)];
      }
      return [...acc, file];
    }, []);
  };

  const allFiles = flattenFiles(files);
  const searchableFiles = allFiles.filter(file => !file.isDirectory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+O or Cmd+O to open quick file search
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleSelectFile = (file: any) => {
    setActiveFile(file);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-[450px]">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            ref={inputRef}
            placeholder="Search for a file..."
            className="h-12"
          />
          <CommandList>
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup heading="Files">
              {searchableFiles.map((file) => (
                <CommandItem
                  key={file.id}
                  onSelect={() => handleSelectFile(file)}
                  className="flex items-center gap-2 py-2"
                  value={`${file.name} ${file.path}`}
                >
                  <FileText size={16} className="text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{file.name}</span>
                    <span className="text-xs text-muted-foreground">{file.path}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
