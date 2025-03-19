
import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { File, Search, Settings, FileCode, Save, FolderOpen } from 'lucide-react';

interface CommandOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export default function CommandPalette() {
  const { files, setActiveFile, theme, toggleTheme } = useEditor();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define available commands
  const commands: CommandOption[] = [
    {
      id: 'theme-toggle',
      label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
      icon: <Settings size={16} />,
      action: () => toggleTheme(theme === 'dark' ? 'light' : 'dark'),
      keywords: ['theme', 'dark', 'light', 'toggle', 'switch', 'appearance']
    },
    {
      id: 'save-file',
      label: 'Save current file',
      icon: <Save size={16} />,
      action: () => console.log('Save file command triggered'),
      keywords: ['save', 'file', 'write', 'disk']
    },
    {
      id: 'open-folder',
      label: 'Open folder',
      icon: <FolderOpen size={16} />,
      action: () => console.log('Open folder command triggered'),
      keywords: ['open', 'folder', 'directory']
    },
  ];

  // Add file commands dynamically
  const fileCommands = files.map(file => ({
    id: `open-${file.id}`,
    label: `Open ${file.path}`,
    icon: <FileCode size={16} />,
    action: () => setActiveFile(file),
    keywords: [file.name, file.path, 'open', 'file'],
  }));

  const allCommands = [...commands, ...fileCommands];

  // Handle keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+P or Cmd+P to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setOpen(true);
      }
      
      // Escape to close
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus the input field when command palette is opened
  useEffect(() => {
    if (open && inputRef.current) {
      // Short timeout to ensure the dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const runCommand = (command: CommandOption) => {
    command.action();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-[600px]">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            ref={inputRef}
            placeholder="Type a command or search..." 
            className="h-12"
          />
          <CommandList>
            <CommandGroup heading="Commands">
              {allCommands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => runCommand(command)}
                  className="flex items-center gap-2 py-2"
                >
                  <span className="flex items-center justify-center text-muted-foreground">
                    {command.icon}
                  </span>
                  <span>{command.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
