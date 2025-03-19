
import React, { useState } from 'react';
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
import AppearanceSettings from './settings/AppearanceSettings';
import EditorOptionsSettings from './settings/EditorOptionsSettings';
import GitSettings from './settings/GitSettings';
import TerminalSettings from './settings/TerminalSettings';
import LSPSettings from './settings/LSPSettings';

export default function SettingsMenu() {
  const { plugins, activatePlugin, deactivatePlugin, isPluginActive } = usePluginManager();
  
  // State for controlling which settings panel is open
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  
  const openSettings = (settingType: string) => {
    setActiveSettings(settingType);
  };
  
  const closeSettings = () => {
    setActiveSettings(null);
  };

  return (
    <>
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
            <DropdownMenuItem onClick={() => openSettings('appearance')}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>Appearance</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSettings('editorOptions')}>
              <PenTool className="mr-2 h-4 w-4" />
              <span>Editor Options</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Integrations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => openSettings('git')}>
              <GitBranch className="mr-2 h-4 w-4" />
              <span>Git</span>
              <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSettings('terminal')}>
              <Terminal className="mr-2 h-4 w-4" />
              <span>Terminal</span>
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSettings('lsp')}>
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
      
      {/* Appearance Settings */}
      <AppearanceSettings 
        isOpen={activeSettings === 'appearance'} 
        onClose={closeSettings} 
      />
      
      {/* Editor Options Settings */}
      <EditorOptionsSettings 
        isOpen={activeSettings === 'editorOptions'} 
        onClose={closeSettings} 
      />
      
      {/* Git Settings */}
      <GitSettings 
        isOpen={activeSettings === 'git'} 
        onClose={closeSettings} 
      />
      
      {/* Terminal Settings */}
      <TerminalSettings 
        isOpen={activeSettings === 'terminal'} 
        onClose={closeSettings} 
      />
      
      {/* LSP Settings */}
      <LSPSettings 
        isOpen={activeSettings === 'lsp'} 
        onClose={closeSettings} 
      />
    </>
  );
}
