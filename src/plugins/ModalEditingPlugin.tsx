
import React from 'react';
import { PluginDefinition, PluginAPI } from './PluginManager';

// Define modes
type EditMode = 'normal' | 'insert' | 'visual';

const ModalEditingPlugin: PluginDefinition = {
  id: 'modal-editing',
  name: 'Modal Editing',
  description: 'Adds Vim-like modal editing capabilities to the editor',
  version: '1.0.0',
  author: 'TextForge',
  
  activate: (api: PluginAPI) => {
    let currentMode: EditMode = 'normal';
    let editor = api.editor;
    let modeStatusItem: string | null = null;
    
    // Function to update the status bar with current mode
    const updateModeStatusBar = () => {
      let modeDisplay;
      switch (currentMode) {
        case 'normal':
          modeDisplay = <span className="text-blue-500">NORMAL</span>;
          break;
        case 'insert':
          modeDisplay = <span className="text-green-500">INSERT</span>;
          break;
        case 'visual':
          modeDisplay = <span className="text-purple-500">VISUAL</span>;
          break;
      }
      
      api.registerStatusBarItem(
        'modal.mode',
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-2" 
               style={{ backgroundColor: currentMode === 'normal' ? '#3b82f6' : 
                                        currentMode === 'insert' ? '#10b981' : 
                                        '#8b5cf6' }}></div>
          {modeDisplay}
        </div>,
        'left'
      );
    };
    
    // Initialize editor instance
    if (editor) {
      // Set up key bindings
      const disposables: any[] = [];
      
      // Listen for the Escape key to enter normal mode
      disposables.push(
        editor.onKeyDown((e: any) => {
          if (e.code === 'Escape') {
            currentMode = 'normal';
            updateModeStatusBar();
          } else if (currentMode === 'normal') {
            // Normal mode keys
            if (e.code === 'KeyI') {
              currentMode = 'insert';
              updateModeStatusBar();
              e.preventDefault();
            } else if (e.code === 'KeyV') {
              currentMode = 'visual';
              updateModeStatusBar();
              e.preventDefault();
            }
          }
        })
      );
      
      // Set initial mode
      updateModeStatusBar();
      
      console.log('Modal editing plugin activated');
    } else {
      console.warn('Modal editing plugin: Editor instance not available');
      
      // Wait for editor to be available
      const checkEditorInterval = setInterval(() => {
        if (api.editor) {
          editor = api.editor;
          clearInterval(checkEditorInterval);
          activate(api);
        }
      }, 500);
    }
  },
  
  deactivate: () => {
    console.log('Modal editing plugin deactivated');
  }
};

export default ModalEditingPlugin;
