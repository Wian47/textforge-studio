
import React from 'react';
import { PluginDefinition, PluginAPI } from './PluginManager';

// Define modes
type EditMode = 'normal' | 'insert' | 'visual' | 'command';

// Command history
type CommandHistory = string[];

const ModalEditingPlugin: PluginDefinition = {
  id: 'modal-editing',
  name: 'Modal Editing',
  description: 'Adds Vim-like modal editing capabilities to the editor',
  version: '1.0.0',
  author: 'TextForge',
  
  activate: (api: PluginAPI) => {
    let currentMode: EditMode = 'normal';
    let editor = api.editor;
    let commandBuffer: string = '';
    let commandHistory: CommandHistory = [];
    let historyPosition: number = -1;
    let visualStartPosition: any = null;
    
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
        case 'command':
          modeDisplay = <span className="text-yellow-500">COMMAND</span>;
          break;
      }
      
      api.registerStatusBarItem(
        'modal.mode',
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-2" 
               style={{ backgroundColor: currentMode === 'normal' ? '#3b82f6' : 
                                        currentMode === 'insert' ? '#10b981' : 
                                        currentMode === 'visual' ? '#8b5cf6' : 
                                        '#eab308' }}></div>
          {modeDisplay}
          {currentMode === 'command' && 
            <span className="ml-2 text-xs">:{commandBuffer}</span>
          }
        </div>,
        'left'
      );
    };
    
    // Helper function for cursor movement
    const moveCursor = (direction: 'left' | 'right' | 'up' | 'down', count: number = 1) => {
      if (!editor) return;
      
      const position = editor.getPosition();
      if (!position) return;
      
      const model = editor.getModel();
      if (!model) return;
      
      let newPosition;
      
      switch (direction) {
        case 'left':
          newPosition = { lineNumber: position.lineNumber, column: Math.max(1, position.column - count) };
          break;
        case 'right':
          const lineLength = model.getLineMaxColumn(position.lineNumber);
          newPosition = { lineNumber: position.lineNumber, column: Math.min(lineLength, position.column + count) };
          break;
        case 'up':
          newPosition = { 
            lineNumber: Math.max(1, position.lineNumber - count), 
            column: position.column 
          };
          break;
        case 'down':
          const lineCount = model.getLineCount();
          newPosition = { 
            lineNumber: Math.min(lineCount, position.lineNumber + count), 
            column: position.column 
          };
          break;
      }
      
      editor.setPosition(newPosition);
      editor.revealPositionInCenter(newPosition);
    };
    
    // Helper function for word movement
    const moveByWord = (forward: boolean) => {
      if (!editor) return;
      
      const position = editor.getPosition();
      if (!position) return;
      
      const model = editor.getModel();
      if (!model) return;
      
      const text = model.getLineContent(position.lineNumber);
      let column = position.column;
      
      if (forward) {
        // Move to the end of the current word or to the next word
        const wordRegex = /\w+/g;
        let match;
        while ((match = wordRegex.exec(text.substring(column - 1))) !== null) {
          column = column + match.index + match[0].length;
          break;
        }
      } else {
        // Move to the beginning of the current word or to the previous word
        if (column > 1) {
          const reversedText = text.substring(0, column - 1).split('').reverse().join('');
          const wordRegex = /\w+/g;
          let match = wordRegex.exec(reversedText);
          if (match) {
            column = column - match.index - match[0].length;
          } else {
            column--;
          }
        }
      }
      
      editor.setPosition({ lineNumber: position.lineNumber, column: Math.max(1, column) });
    };
    
    // Execute command from command mode
    const executeCommand = () => {
      if (!editor) return;
      
      // Add command to history
      if (commandBuffer.trim() !== '') {
        commandHistory.push(commandBuffer);
        historyPosition = commandHistory.length;
      }
      
      // Handle basic commands
      switch (commandBuffer) {
        case 'w':
          // Save file (mock implementation)
          console.log('Saving file...');
          break;
        case 'q':
          // Quit (mock implementation)
          console.log('Quitting editor...');
          break;
        case 'wq':
          // Save and quit (mock implementation)
          console.log('Saving and quitting...');
          break;
        default:
          if (commandBuffer.startsWith('set')) {
            // Handle settings commands
            console.log(`Setting: ${commandBuffer}`);
          } else {
            console.log(`Unknown command: ${commandBuffer}`);
          }
      }
      
      commandBuffer = '';
      currentMode = 'normal';
      updateModeStatusBar();
    };
    
    // Initialize editor instance
    if (editor) {
      // Set up key bindings
      const disposables: any[] = [];
      
      // Listen for keydown events
      disposables.push(
        editor.onKeyDown((e: any) => {
          // Handle based on current mode
          switch (currentMode) {
            case 'normal':
              switch (e.code) {
                case 'KeyI': // i - enter insert mode
                  currentMode = 'insert';
                  e.preventDefault();
                  break;
                case 'KeyV': // v - enter visual mode
                  currentMode = 'visual';
                  visualStartPosition = editor.getPosition();
                  e.preventDefault();
                  break;
                case 'Semicolon': // : - enter command mode
                  if (e.shiftKey) {
                    currentMode = 'command';
                    commandBuffer = '';
                    e.preventDefault();
                  }
                  break;
                case 'KeyH': // h - move left
                  moveCursor('left');
                  e.preventDefault();
                  break;
                case 'KeyJ': // j - move down
                  moveCursor('down');
                  e.preventDefault();
                  break;
                case 'KeyK': // k - move up
                  moveCursor('up');
                  e.preventDefault();
                  break;
                case 'KeyL': // l - move right
                  moveCursor('right');
                  e.preventDefault();
                  break;
                case 'KeyW': // w - move forward by word
                  moveByWord(true);
                  e.preventDefault();
                  break;
                case 'KeyB': // b - move backward by word
                  moveByWord(false);
                  e.preventDefault();
                  break;
                case 'KeyO': // o - open line below
                  const position = editor.getPosition();
                  if (position) {
                    const lineCount = editor.getModel()?.getLineCount() || 0;
                    const lineNumber = Math.min(lineCount + 1, position.lineNumber + 1);
                    editor.executeEdits('', [
                      { range: { startLineNumber: lineNumber, startColumn: 1, endLineNumber: lineNumber, endColumn: 1 }, text: '\n' }
                    ]);
                    editor.setPosition({ lineNumber, column: 1 });
                    currentMode = 'insert';
                  }
                  e.preventDefault();
                  break;
                case 'KeyX': // x - delete character at cursor
                  const pos = editor.getPosition();
                  if (pos) {
                    editor.executeEdits('', [
                      { 
                        range: { 
                          startLineNumber: pos.lineNumber, 
                          startColumn: pos.column, 
                          endLineNumber: pos.lineNumber, 
                          endColumn: pos.column + 1 
                        }, 
                        text: '' 
                      }
                    ]);
                  }
                  e.preventDefault();
                  break;
              }
              break;
              
            case 'insert':
              if (e.code === 'Escape') { // Esc - back to normal mode
                currentMode = 'normal';
                e.preventDefault();
              }
              break;
              
            case 'visual':
              if (e.code === 'Escape') { // Esc - back to normal mode
                currentMode = 'normal';
                visualStartPosition = null;
                e.preventDefault();
              } else if (e.code === 'KeyY') { // y - yank (copy) selected text
                if (visualStartPosition) {
                  const currentPosition = editor.getPosition();
                  if (currentPosition) {
                    // Copy text logic would go here
                    console.log('Yanking text from visual selection');
                    currentMode = 'normal';
                    visualStartPosition = null;
                  }
                }
                e.preventDefault();
              }
              // Allow movement keys in visual mode (h, j, k, l)
              switch (e.code) {
                case 'KeyH': // h - move left
                  moveCursor('left');
                  e.preventDefault();
                  break;
                case 'KeyJ': // j - move down
                  moveCursor('down');
                  e.preventDefault();
                  break;
                case 'KeyK': // k - move up
                  moveCursor('up');
                  e.preventDefault();
                  break;
                case 'KeyL': // l - move right
                  moveCursor('right');
                  e.preventDefault();
                  break;
              }
              break;
              
            case 'command':
              if (e.code === 'Escape') { // Esc - back to normal mode
                currentMode = 'normal';
                commandBuffer = '';
                e.preventDefault();
              } else if (e.code === 'Enter') { // Enter - execute command
                executeCommand();
                e.preventDefault();
              } else if (e.code === 'Backspace') { // Backspace - delete last character
                commandBuffer = commandBuffer.substring(0, commandBuffer.length - 1);
                e.preventDefault();
              } else if (e.code === 'ArrowUp') { // Up - navigate command history
                if (historyPosition > 0) {
                  historyPosition--;
                  commandBuffer = commandHistory[historyPosition];
                }
                e.preventDefault();
              } else if (e.code === 'ArrowDown') { // Down - navigate command history
                if (historyPosition < commandHistory.length - 1) {
                  historyPosition++;
                  commandBuffer = commandHistory[historyPosition];
                } else {
                  historyPosition = commandHistory.length;
                  commandBuffer = '';
                }
                e.preventDefault();
              } else if (e.key.length === 1) { // Any printable character
                commandBuffer += e.key;
                e.preventDefault();
              }
              break;
          }
          
          // Update the status bar to reflect mode changes
          updateModeStatusBar();
        })
      );
      
      // Set initial mode
      updateModeStatusBar();
      
      console.log('Modal editing plugin activated with enhanced key bindings');
    } else {
      console.warn('Modal editing plugin: Editor instance not available');
      
      // Wait for editor to be available
      const checkEditorInterval = setInterval(() => {
        if (api.editor) {
          editor = api.editor;
          clearInterval(checkEditorInterval);
          // Call the plugin's own activate method again with the updated API
          ModalEditingPlugin.activate(api);
        }
      }, 500);
    }
  },
  
  deactivate: () => {
    console.log('Modal editing plugin deactivated');
  }
};

export default ModalEditingPlugin;
