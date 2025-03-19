
import React, { useEffect } from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { PluginManagerProvider, usePluginManager } from '@/plugins/PluginManager';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MonacoEditor from '@/components/Editor';
import StatusBar from '@/components/StatusBar';
import SamplePlugin from '@/plugins/SamplePlugin';
import ModalEditingPlugin from '@/plugins/ModalEditingPlugin';

// Component to load plugins
const PluginLoader = () => {
  const { registerPlugin, activatePlugin } = usePluginManager();
  
  useEffect(() => {
    // Register and activate sample plugin
    registerPlugin(SamplePlugin);
    activatePlugin('sample-plugin');
    
    // Register and activate modal editing plugin
    registerPlugin(ModalEditingPlugin);
    activatePlugin('modal-editing');
  }, [registerPlugin, activatePlugin]);
  
  return null;
};

const Index = () => {
  return (
    <EditorProvider>
      <PluginManagerProvider>
        <div className="flex flex-col h-screen w-full overflow-hidden">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <MonacoEditor />
            </div>
          </div>
          <StatusBar />
          <PluginLoader />
        </div>
      </PluginManagerProvider>
    </EditorProvider>
  );
};

export default Index;
