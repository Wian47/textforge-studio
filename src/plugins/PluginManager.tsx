
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  activate: (api: PluginAPI) => void;
  deactivate?: () => void;
}

export interface PluginAPI {
  editor: any; // Monaco editor instance
  registerCommand: (id: string, handler: () => void) => void;
  registerStatusBarItem: (id: string, element: React.ReactNode, position: 'left' | 'right') => void;
  registerFileDecorator: (id: string, decorator: (file: any) => React.ReactNode) => void;
}

type PluginManagerContextType = {
  plugins: PluginDefinition[];
  loadedPlugins: string[];
  registerPlugin: (plugin: PluginDefinition) => void;
  activatePlugin: (id: string) => void;
  deactivatePlugin: (id: string) => void;
  isPluginActive: (id: string) => boolean;
  pluginAPI: PluginAPI | null;
};

const PluginManagerContext = createContext<PluginManagerContextType | undefined>(undefined);

export function PluginManagerProvider({ children }: { children: React.ReactNode }) {
  const { activeFile } = useEditor();
  const [plugins, setPlugins] = useState<PluginDefinition[]>([]);
  const [loadedPlugins, setLoadedPlugins] = useState<string[]>([]);
  const [commands, setCommands] = useState<Record<string, () => void>>({});
  const [statusBarItems, setStatusBarItems] = useState<Record<string, { element: React.ReactNode, position: 'left' | 'right' }>>({});
  const [fileDecorators, setFileDecorators] = useState<Record<string, (file: any) => React.ReactNode>>({});
  
  // Create a plugin API instance
  const pluginAPI: PluginAPI = {
    editor: null, // Will be set when editor is available
    registerCommand: (id, handler) => {
      setCommands(prev => ({ ...prev, [id]: handler }));
    },
    registerStatusBarItem: (id, element, position) => {
      setStatusBarItems(prev => ({ ...prev, [id]: { element, position } }));
    },
    registerFileDecorator: (id, decorator) => {
      setFileDecorators(prev => ({ ...prev, [id]: decorator }));
    }
  };

  const registerPlugin = (plugin: PluginDefinition) => {
    setPlugins(prev => {
      // Check if plugin already exists
      if (prev.some(p => p.id === plugin.id)) {
        return prev.map(p => p.id === plugin.id ? plugin : p);
      }
      return [...prev, plugin];
    });
  };

  const activatePlugin = (id: string) => {
    const plugin = plugins.find(p => p.id === id);
    if (plugin && !loadedPlugins.includes(id)) {
      try {
        plugin.activate(pluginAPI);
        setLoadedPlugins(prev => [...prev, id]);
        console.log(`Plugin ${plugin.name} activated`);
      } catch (error) {
        console.error(`Failed to activate plugin ${plugin.name}:`, error);
      }
    }
  };

  const deactivatePlugin = (id: string) => {
    const plugin = plugins.find(p => p.id === id);
    if (plugin && loadedPlugins.includes(id) && plugin.deactivate) {
      try {
        plugin.deactivate();
        setLoadedPlugins(prev => prev.filter(pluginId => pluginId !== id));
        console.log(`Plugin ${plugin.name} deactivated`);
      } catch (error) {
        console.error(`Failed to deactivate plugin ${plugin.name}:`, error);
      }
    }
  };

  const isPluginActive = (id: string) => loadedPlugins.includes(id);

  return (
    <PluginManagerContext.Provider
      value={{
        plugins,
        loadedPlugins,
        registerPlugin,
        activatePlugin,
        deactivatePlugin,
        isPluginActive,
        pluginAPI,
      }}
    >
      {children}
    </PluginManagerContext.Provider>
  );
}

export function usePluginManager() {
  const context = useContext(PluginManagerContext);
  if (context === undefined) {
    throw new Error('usePluginManager must be used within a PluginManagerProvider');
  }
  return context;
}
