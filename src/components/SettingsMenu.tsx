
import React from 'react';
import { Settings, Monitor, PenTool, GitBranch, Terminal, Brain } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { usePluginManager } from '@/plugins/PluginManager';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SettingsMenu() {
  const { activeFile } = useEditor();
  const { plugins, activatePlugin, deactivatePlugin, isPluginActive } = usePluginManager();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "p-2 rounded-md transition-all duration-200",
            "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30",
            "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Settings"
        >
          <Settings size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Appearance</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PenTool className="mr-2 h-4 w-4" />
            <span>Editor Options</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Integrations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <GitBranch className="mr-2 h-4 w-4" />
            <span>Git</span>
            <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Terminal className="mr-2 h-4 w-4" />
            <span>Terminal</span>
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Brain className="mr-2 h-4 w-4" />
            <span>LSP</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Plugins</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {plugins.map((plugin) => (
          <DropdownMenuItem 
            key={plugin.id}
            onClick={() => isPluginActive(plugin.id) 
              ? deactivatePlugin(plugin.id) 
              : activatePlugin(plugin.id)
            }
          >
            <span>{plugin.name}</span>
            <DropdownMenuShortcut>
              {isPluginActive(plugin.id) ? '✓' : ''}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
