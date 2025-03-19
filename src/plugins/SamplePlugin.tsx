
import { PluginDefinition, PluginAPI } from './PluginManager';

const SamplePlugin: PluginDefinition = {
  id: 'sample-plugin',
  name: 'Sample Plugin',
  description: 'A sample plugin to demonstrate the plugin system',
  version: '1.0.0',
  author: 'TextForge',
  
  activate: (api: PluginAPI) => {
    // Register a command
    api.registerCommand('sample.hello', () => {
      console.log('Hello from sample plugin!');
    });
    
    // Register a status bar item
    api.registerStatusBarItem(
      'sample.status',
      <span className="text-green-500">Plugin Active</span>,
      'right'
    );
    
    console.log('Sample plugin activated');
  },
  
  deactivate: () => {
    console.log('Sample plugin deactivated');
  }
};

export default SamplePlugin;
